# Documentation Technique - Migration AfriSpot vers Production

## Table des Matières

1. [Architecture Actuelle vs Cible](#architecture-actuelle-vs-cible)
2. [Migration Base de Données](#migration-base-de-données)
3. [Sécurisation de l'Application](#sécurisation-de-lapplication)
4. [APIs et Backend](#apis-et-backend)
5. [Modifications Frontend](#modifications-frontend)
6. [Déploiement et Infrastructure](#déploiement-et-infrastructure)

---

## Architecture Actuelle vs Cible

### 🔄 État Actuel
```
Frontend React → localStorage → Données temporaires
└── Authentification basique (hardcodée)
└── Pas de validation côté serveur
└── Pas de persistance réelle
```

### 🎯 Architecture Cible
```
Frontend React → API REST → Base de Données SQL
├── JWT Authentication
├── Rate Limiting
├── Input Validation
├── RBAC (Role-Based Access Control)
└── Audit Logs
```

---

## Migration Base de Données

### 📊 Schéma SQL Complet

#### 1. Tables Principales

```sql
-- Table des utilisateurs et authentification
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('admin', 'manager', 'staff') DEFAULT 'staff',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP NULL,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role)
);

-- Table des catégories de menu
CREATE TABLE menu_categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_order (display_order)
);

-- Table des items du menu
CREATE TABLE menu_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    category_id VARCHAR(36) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    image_alt TEXT,
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    allergens JSON,
    nutritional_info JSON,
    preparation_time INT, -- en minutes
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES menu_categories(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_available (is_available),
    INDEX idx_featured (is_featured),
    INDEX idx_price (price)
);

-- Table des réservations
CREATE TABLE reservations (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guests_count INT NOT NULL CHECK (guests_count > 0 AND guests_count <= 20),
    special_requests TEXT,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'pending',
    table_number VARCHAR(10),
    confirmed_by VARCHAR(36),
    confirmed_at TIMESTAMP NULL,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (confirmed_by) REFERENCES users(id) ON SET NULL,
    INDEX idx_date_time (reservation_date, reservation_time),
    INDEX idx_status (status),
    INDEX idx_customer_phone (customer_phone),
    INDEX idx_customer_email (customer_email)
);

-- Table des avis clients
CREATE TABLE reviews (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    customer_name VARCHAR(200) NOT NULL,
    customer_email VARCHAR(255),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    approved_by VARCHAR(36),
    approved_at TIMESTAMP NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON SET NULL,
    INDEX idx_approved (is_approved),
    INDEX idx_featured (is_featured),
    INDEX idx_rating (rating),
    INDEX idx_email (customer_email)
);

-- Table des sessions utilisateur
CREATE TABLE user_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_token (token_hash),
    INDEX idx_expires (expires_at)
);

-- Table d'audit des actions
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(36),
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_created (created_at)
);
```

#### 2. Données d'initialisation

```sql
-- Insertion des catégories par défaut
INSERT INTO menu_categories (id, name, slug, description, display_order) VALUES
(UUID(), 'Entrées', 'entrees', 'Nos délicieuses entrées africaines', 1),
(UUID(), 'Plats Principaux', 'plats', 'Nos spécialités de plats traditionnels', 2),
(UUID(), 'Desserts', 'desserts', 'Nos desserts maison', 3),
(UUID(), 'Boissons', 'boissons', 'Boissons fraîches et chaudes', 4);

-- Création du compte admin par défaut
INSERT INTO users (id, email, username, password_hash, role) VALUES
(UUID(), 'admin@afrispot.com', 'admin', '$2b$12$hashedpassword', 'admin');
```

### 🔧 Migration des Données Existantes

#### Script de Migration JavaScript

```javascript
// scripts/migrate-data.js
const mysql = require('mysql2/promise');

class DataMigrator {
    constructor(dbConfig) {
        this.db = mysql.createConnection(dbConfig);
    }

    async migrateMenuItems() {
        // Récupération des données localStorage
        const localMenuData = localStorage.getItem('afrispot_menu');
        const menuItems = JSON.parse(localMenuData || '[]');

        for (const item of menuItems) {
            // Récupération de l'ID de catégorie
            const [categories] = await this.db.execute(
                'SELECT id FROM menu_categories WHERE slug = ?',
                [this.normalizeCategory(item.category)]
            );

            if (categories.length > 0) {
                await this.db.execute(`
                    INSERT INTO menu_items 
                    (id, category_id, name, description, price, image_url, is_available, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    item.id,
                    categories[0].id,
                    item.name,
                    item.description,
                    item.price,
                    item.image,
                    item.available,
                    item.createdAt
                ]);
            }
        }
    }

    async migrateReviews() {
        const localReviewsData = localStorage.getItem('afrispot_reviews');
        const reviews = JSON.parse(localReviewsData || '[]');

        for (const review of reviews) {
            await this.db.execute(`
                INSERT INTO reviews 
                (id, customer_name, customer_email, rating, comment, is_approved, is_featured, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                review.id,
                review.name,
                review.email,
                review.rating,
                review.comment,
                review.approved,
                review.featured,
                review.createdAt
            ]);
        }
    }

    normalizeCategory(category) {
        const categoryMap = {
            'entrées': 'entrees',
            'plats': 'plats',
            'desserts': 'desserts',
            'boissons': 'boissons'
        };
        return categoryMap[category] || 'plats';
    }
}
```

---

## Sécurisation de l'Application

### 🔐 Authentification JWT

#### Configuration JWT

```javascript
// server/config/jwt.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthService {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
        this.REFRESH_TOKEN_EXPIRES_IN = '7d';
    }

    async hashPassword(password) {
        return await bcrypt.hash(password, 12);
    }

    async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN
        });
        
        const refreshToken = jwt.sign(payload, this.JWT_SECRET, {
            expiresIn: this.REFRESH_TOKEN_EXPIRES_IN
        });

        return { accessToken, refreshToken };
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}
```

#### Middleware d'Authentification

```javascript
// server/middleware/auth.js
const AuthService = require('../config/jwt');

class AuthMiddleware {
    static async authenticate(req, res, next) {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            
            if (!token) {
                return res.status(401).json({ error: 'Token manquant' });
            }

            const authService = new AuthService();
            const decoded = authService.verifyToken(token);
            
            // Vérification que la session est active
            const [sessions] = await req.db.execute(
                'SELECT * FROM user_sessions WHERE user_id = ? AND token_hash = ? AND is_active = true AND expires_at > NOW()',
                [decoded.userId, token]
            );

            if (sessions.length === 0) {
                return res.status(401).json({ error: 'Session expirée' });
            }

            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Token invalide' });
        }
    }

    static requireRole(roles) {
        return (req, res, next) => {
            if (!req.user || !roles.includes(req.user.role)) {
                return res.status(403).json({ error: 'Accès refusé' });
            }
            next();
        };
    }

    static async rateLimiter(req, res, next) {
        const ip = req.ip;
        const key = `rate_limit:${ip}`;
        
        // Implementation avec Redis recommandée
        // Limite : 100 requêtes par 15 minutes
        const limit = 100;
        const window = 15 * 60 * 1000; // 15 minutes

        // Logic de rate limiting
        next();
    }
}
```

### 🛡️ Validation et Sanitization

```javascript
// server/middleware/validation.js
const Joi = require('joi');
const DOMPurify = require('isomorphic-dompurify');

class ValidationMiddleware {
    static validateReservation(req, res, next) {
        const schema = Joi.object({
            customer_name: Joi.string().min(2).max(200).required(),
            customer_email: Joi.string().email().optional(),
            customer_phone: Joi.string().pattern(/^[+]?[\d\s\-()]+$/).required(),
            reservation_date: Joi.date().min('now').required(),
            reservation_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
            guests_count: Joi.number().integer().min(1).max(20).required(),
            special_requests: Joi.string().max(1000).optional()
        });

        const { error, value } = schema.validate(req.body);
        
        if (error) {
            return res.status(400).json({ 
                error: 'Données invalides', 
                details: error.details 
            });
        }

        // Sanitization
        req.body = this.sanitizeObject(value);
        next();
    }

    static validateMenuItem(req, res, next) {
        const schema = Joi.object({
            name: Joi.string().min(2).max(200).required(),
            description: Joi.string().max(1000).optional(),
            price: Joi.number().positive().precision(2).required(),
            category_id: Joi.string().uuid().required(),
            image_url: Joi.string().uri().optional(),
            is_available: Joi.boolean().default(true),
            allergens: Joi.array().items(Joi.string()).optional()
        });

        const { error, value } = schema.validate(req.body);
        
        if (error) {
            return res.status(400).json({ 
                error: 'Données invalides', 
                details: error.details 
            });
        }

        req.body = this.sanitizeObject(value);
        next();
    }

    static sanitizeObject(obj) {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                sanitized[key] = DOMPurify.sanitize(value);
            } else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    }
}
```

### 🔒 Sécurité Headers & CORS

```javascript
// server/middleware/security.js
const helmet = require('helmet');
const cors = require('cors');

const securityMiddleware = (app) => {
    // Helmet pour les headers de sécurité
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https:"],
                scriptSrc: ["'self'"],
                connectSrc: ["'self'", process.env.API_URL]
            }
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        }
    }));

    // CORS configuration
    app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Additional security headers
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        next();
    });
};
```

---

## APIs et Backend

### 🌐 Structure des Endpoints

```javascript
// server/routes/api.js
const express = require('express');
const AuthMiddleware = require('../middleware/auth');
const ValidationMiddleware = require('../middleware/validation');

const router = express.Router();

// Routes publiques
router.post('/auth/login', ValidationMiddleware.validateLogin, AuthController.login);
router.post('/reservations', ValidationMiddleware.validateReservation, ReservationController.create);
router.get('/menu', MenuController.getPublicMenu);
router.get('/reviews/approved', ReviewController.getApprovedReviews);
router.post('/reviews', ValidationMiddleware.validateReview, ReviewController.create);

// Routes protégées (Admin)
router.use('/admin', AuthMiddleware.authenticate, AuthMiddleware.requireRole(['admin', 'manager']));

// Gestion des réservations
router.get('/admin/reservations', ReservationController.getAll);
router.patch('/admin/reservations/:id/status', ValidationMiddleware.validateReservationStatus, ReservationController.updateStatus);
router.delete('/admin/reservations/:id', ReservationController.delete);

// Gestion du menu
router.get('/admin/menu', MenuController.getAll);
router.post('/admin/menu', ValidationMiddleware.validateMenuItem, MenuController.create);
router.put('/admin/menu/:id', ValidationMiddleware.validateMenuItem, MenuController.update);
router.delete('/admin/menu/:id', MenuController.delete);
router.patch('/admin/menu/:id/availability', MenuController.toggleAvailability);

// Gestion des avis
router.get('/admin/reviews', ReviewController.getAll);
router.patch('/admin/reviews/:id/approve', ReviewController.toggleApproval);
router.patch('/admin/reviews/:id/feature', ReviewController.toggleFeature);
router.delete('/admin/reviews/:id', ReviewController.delete);

// Analytics
router.get('/admin/analytics', AnalyticsController.getDashboardStats);

module.exports = router;
```

### 📊 Contrôleurs

```javascript
// server/controllers/MenuController.js
class MenuController {
    static async getPublicMenu(req, res) {
        try {
            const [items] = await req.db.execute(`
                SELECT 
                    mi.id, mi.name, mi.description, mi.price, mi.image_url,
                    mc.name as category_name, mc.slug as category_slug
                FROM menu_items mi
                JOIN menu_categories mc ON mi.category_id = mc.id
                WHERE mi.is_available = true AND mc.is_active = true
                ORDER BY mc.display_order, mi.display_order, mi.name
            `);

            const menuByCategory = items.reduce((acc, item) => {
                const category = item.category_slug;
                if (!acc[category]) {
                    acc[category] = {
                        name: item.category_name,
                        items: []
                    };
                }
                acc[category].items.push({
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image_url: item.image_url
                });
                return acc;
            }, {});

            res.json({ menu: menuByCategory });
        } catch (error) {
            console.error('Error fetching menu:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    static async create(req, res) {
        try {
            const id = require('uuid').v4();
            const { category_id, name, description, price, image_url, is_available } = req.body;

            await req.db.execute(`
                INSERT INTO menu_items (id, category_id, name, description, price, image_url, is_available)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [id, category_id, name, description, price, image_url, is_available]);

            // Audit log
            await AuditLogger.log(req.user.id, 'CREATE', 'menu_item', id, null, req.body, req);

            res.status(201).json({ id, message: 'Plat créé avec succès' });
        } catch (error) {
            console.error('Error creating menu item:', error);
            res.status(500).json({ error: 'Erreur lors de la création' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;

            // Récupération des anciennes valeurs pour l'audit
            const [oldItem] = await req.db.execute('SELECT * FROM menu_items WHERE id = ?', [id]);

            await req.db.execute(`
                UPDATE menu_items 
                SET category_id = ?, name = ?, description = ?, price = ?, image_url = ?, is_available = ?, updated_at = NOW()
                WHERE id = ?
            `, [updates.category_id, updates.name, updates.description, updates.price, updates.image_url, updates.is_available, id]);

            // Audit log
            await AuditLogger.log(req.user.id, 'UPDATE', 'menu_item', id, oldItem[0], updates, req);

            res.json({ message: 'Plat mis à jour avec succès' });
        } catch (error) {
            console.error('Error updating menu item:', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour' });
        }
    }
}
```

---

## Modifications Frontend

### 🔄 Services API

```typescript
// src/services/api.ts
interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

class ApiService {
    private baseURL: string;
    private token: string | null = null;

    constructor() {
        this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
        this.token = localStorage.getItem('auth_token');
    }

    private async request<T>(
        endpoint: string, 
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;
        
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    this.logout();
                }
                throw new Error(data.error || 'Erreur réseau');
            }

            return { data };
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            return { error: error instanceof Error ? error.message : 'Erreur inconnue' };
        }
    }

    // Authentification
    async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
        const response = await this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        if (response.data?.token) {
            this.token = response.data.token;
            localStorage.setItem('auth_token', this.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response;
    }

    logout(): void {
        this.token = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/admin';
    }

    // Menu API
    async getPublicMenu(): Promise<ApiResponse<MenuByCategory>> {
        return this.request<MenuByCategory>('/menu');
    }

    async getAdminMenu(): Promise<ApiResponse<MenuItem[]>> {
        return this.request<MenuItem[]>('/admin/menu');
    }

    async createMenuItem(item: CreateMenuItemRequest): Promise<ApiResponse<{ id: string }>> {
        return this.request<{ id: string }>('/admin/menu', {
            method: 'POST',
            body: JSON.stringify(item),
        });
    }

    async updateMenuItem(id: string, updates: UpdateMenuItemRequest): Promise<ApiResponse<void>> {
        return this.request<void>(`/admin/menu/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    async deleteMenuItem(id: string): Promise<ApiResponse<void>> {
        return this.request<void>(`/admin/menu/${id}`, {
            method: 'DELETE',
        });
    }

    async toggleMenuItemAvailability(id: string): Promise<ApiResponse<void>> {
        return this.request<void>(`/admin/menu/${id}/availability`, {
            method: 'PATCH',
        });
    }

    // Réservations API
    async createReservation(reservation: CreateReservationRequest): Promise<ApiResponse<{ id: string }>> {
        return this.request<{ id: string }>('/reservations', {
            method: 'POST',
            body: JSON.stringify(reservation),
        });
    }

    async getReservations(): Promise<ApiResponse<Reservation[]>> {
        return this.request<Reservation[]>('/admin/reservations');
    }

    async updateReservationStatus(id: string, status: ReservationStatus): Promise<ApiResponse<void>> {
        return this.request<void>(`/admin/reservations/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    }

    // Reviews API
    async getApprovedReviews(): Promise<ApiResponse<Review[]>> {
        return this.request<Review[]>('/reviews/approved');
    }

    async getAllReviews(): Promise<ApiResponse<Review[]>> {
        return this.request<Review[]>('/admin/reviews');
    }

    async createReview(review: CreateReviewRequest): Promise<ApiResponse<{ id: string }>> {
        return this.request<{ id: string }>('/reviews', {
            method: 'POST',
            body: JSON.stringify(review),
        });
    }

    async toggleReviewApproval(id: string): Promise<ApiResponse<void>> {
        return this.request<void>(`/admin/reviews/${id}/approve`, {
            method: 'PATCH',
        });
    }

    async toggleReviewFeature(id: string): Promise<ApiResponse<void>> {
        return this.request<void>(`/admin/reviews/${id}/feature`, {
            method: 'PATCH',
        });
    }

    async deleteReview(id: string): Promise<ApiResponse<void>> {
        return this.request<void>(`/admin/reviews/${id}`, {
            method: 'DELETE',
        });
    }
}

export const apiService = new ApiService();
```

### 🎯 Hooks Personnalisés

```typescript
// src/hooks/useAuth.ts
import { useState, useEffect, createContext, useContext } from 'react';
import { apiService } from '@/services/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('auth_token');
            
            if (storedUser && token) {
                setUser(JSON.parse(storedUser));
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials): Promise<boolean> => {
        setIsLoading(true);
        const response = await apiService.login(credentials);
        
        if (response.data) {
            setUser(response.data.user);
            setIsLoading(false);
            return true;
        }
        
        setIsLoading(false);
        return false;
    };

    const logout = () => {
        setUser(null);
        apiService.logout();
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
```

```typescript
// src/hooks/useApi.ts
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseApiResult<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useApi = <T>(
    apiCall: () => Promise<ApiResponse<T>>,
    dependencies: any[] = []
): UseApiResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);

        const response = await apiCall();

        if (response.data) {
            setData(response.data);
        } else if (response.error) {
            setError(response.error);
            toast({
                title: "Erreur",
                description: response.error,
                variant: "destructive",
            });
        }

        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, dependencies);

    return { data, isLoading, error, refetch: fetchData };
};
```

### 🔒 Composant de Protection des Routes

```typescript
// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    requiredRole 
}) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin" state={{ from: location }} replace />;
    }

    if (requiredRole && !requiredRole.includes(user?.role || '')) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};
```

### 📝 Composants Admin Modifiés

```typescript
// src/components/admin/ReservationsManagement.tsx (version API)
import { useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const ReservationsManagement = () => {
    const { toast } = useToast();
    const { 
        data: reservations, 
        isLoading, 
        refetch 
    } = useApi(() => apiService.getReservations());

    const updateReservationStatus = async (id: string, status: ReservationStatus) => {
        const response = await apiService.updateReservationStatus(id, status);
        
        if (response.error) {
            toast({
                title: "Erreur",
                description: response.error,
                variant: "destructive",
            });
        } else {
            toast({
                title: "Succès",
                description: `Réservation ${status === 'confirmed' ? 'confirmée' : 'annulée'}`,
            });
            refetch();
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>;
    }

    // Reste du composant...
};
```

---

## Déploiement et Infrastructure

### 🐳 Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: afrispot
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./sql/init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  api:
    build: .
    environment:
      NODE_ENV: production
      DATABASE_URL: mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@mysql:3306/afrispot
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
    ports:
      - "3001:3001"
    depends_on:
      - mysql
      - redis

volumes:
  mysql_data:
  redis_data:
```

### 🌍 Variables d'Environnement

```bash
# .env.production
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=mysql://user:password@localhost:3306/afrispot
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=afrispot
DATABASE_USER=afrispot_user
DATABASE_PASSWORD=your_secure_password

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_very_long_random_secret_key_here
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=https://yoursite.com

# Security
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_TIME=15

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Email (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 📊 Monitoring et Logging

```javascript
// server/middleware/logging.js
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'afrispot-api' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
    });
    
    next();
};

module.exports = { logger, requestLogger };
```

---

## Checklist de Migration

### ✅ Phase 1: Préparation
- [ ] Setup de l'environnement de développement
- [ ] Configuration de la base de données MySQL
- [ ] Création des tables et relations
- [ ] Migration des données localStorage

### ✅ Phase 2: Backend
- [ ] Setup Express.js avec middlewares de sécurité
- [ ] Implémentation de l'authentification JWT
- [ ] Création des endpoints API
- [ ] Validation et sanitization des données
- [ ] Tests unitaires et d'intégration

### ✅ Phase 3: Frontend
- [ ] Refactoring des composants pour utiliser les APIs
- [ ] Implémentation du service API
- [ ] Gestion d'état avec les hooks personnalisés
- [ ] Protection des routes admin
- [ ] Gestion des erreurs et loading states

### ✅ Phase 4: Sécurité
- [ ] Configuration HTTPS
- [ ] Headers de sécurité
- [ ] Rate limiting
- [ ] Audit logging
- [ ] Tests de sécurité

### ✅ Phase 5: Déploiement
- [ ] Configuration Docker
- [ ] Setup CI/CD
- [ ] Monitoring et alertes
- [ ] Backup automatique
- [ ] Documentation technique

---

*Cette documentation technique couvre tous les aspects nécessaires pour migrer AfriSpot vers une architecture de production sécurisée et scalable.*