# 💼 GESTHUM – Sistema de Gestión del Talento Humano

> _"Digitalizando el reclutamiento interno con inteligencia artificial y transparencia."_

![Banner Gesthum](https://img.shields.io/badge/Proyecto-GESTHUM-2e7d32?style=for-the-badge&logo=windows&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React.js-61dafb?style=for-the-badge&logo=react&logoColor=white)
![.NET](https://img.shields.io/badge/Backend-.NET%208-512bd4?style=for-the-badge&logo=dotnet&logoColor=white)
![SQLServer](https://img.shields.io/badge/Database-SQL%20Server-a4373a?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)
![Gemini](https://img.shields.io/badge/IA-Google%20Gemini-4285f4?style=for-the-badge&logo=google&logoColor=white)

---

## 📘 Descripción General

**GESTHUM** es una aplicación web para la **gestión del talento humano**, enfocada en los **procesos de reclutamiento interno**.  
Su propósito es centralizar la publicación de vacantes, la creación de currículums personalizados y el seguimiento de postulaciones, integrando un **módulo de Inteligencia Artificial (IA)** basado en **Google Gemini API**.

El sistema optimiza los procesos administrativos, mejora la experiencia del empleado y fomenta la transparencia en los procesos de selección interna.

---

## 🎯 Objetivos del Proyecto

- Centralizar la gestión de vacantes internas y postulaciones.
- Facilitar la creación y administración de currículums personalizados.
- Integrar un **evaluador inteligente** que analice postulaciones en tiempo real.
- Mejorar la eficiencia y transparencia en los procesos de Recursos Humanos.

---

## 🧠 Arquitectura del Sistema

El sistema está compuesto por tres capas principales, bajo el enfoque de **Clean Architecture**:

```
Frontend (React)
   │
   ├──> API REST (.NET 8, ASP.NET Core)
   │        ├──> Autenticación JWT
   │        ├──> Integración con Google Gemini API
   │        └──> Controladores y servicios de dominio
   │
   └──> Base de Datos (SQL Server)
            ├── Empleados
            ├── Curriculums
            ├── Vacantes
            ├── Postulaciones
            ├── Evaluaciones IA
            └── Administradores
```

**Despliegue:**
- **Frontend:** Vercel / Netlify  
- **Backend y BD:** Somee / Windows Server con SQL Server  
- **Seguridad:** HTTPS + JWT  
- **IA:** Google Gemini API (evaluación de CVs)

---

## 🧩 Principales Módulos

| Módulo | Descripción |
|--------|--------------|
| **Autenticación (MA)** | Ingreso mediante identidad federada con roles (empleado / administrador). |
| **Vacantes (MV)** | Creación, edición y desactivación de vacantes internas. |
| **Currículum (CV)** | Creación y edición de CVs personalizados para postulaciones internas. |
| **Postulaciones (MH)** | Seguimiento y estado de las aplicaciones enviadas. |
| **Evaluación IA (ME)** | Evaluación automática de perfiles mediante IA. |
| **Perfil Personal (MP)** | Visualización y edición del perfil del empleado. |
| **Reportes y Resultados** | Estadísticas y métricas generadas por la IA. |
| **Centro de Ayuda** | Preguntas frecuentes, soporte y reportes de incidentes. |

---

## 🧰 Tecnologías Utilizadas

| Capa | Tecnología |
|------|-------------|
| **Frontend** | React JS, Vite, TailwindCSS, Axios |
| **Backend** | .NET 8, ASP.NET Core Web API |
| **Base de Datos** | Microsoft SQL Server |
| **IA** | Google Gemini API |
| **Seguridad** | JWT Authentication, HTTPS |
| **Despliegue** | Vercel / Netlify (frontend), Somee (backend) |

---

## 🔐 Seguridad y Rendimiento

- Autenticación y control de roles con **JWT**.  
- Comunicación segura vía **HTTPS**.  
- Respaldo automático diario de la base de datos.  
- Soporte para **20+ usuarios concurrentes** sin degradar rendimiento.  
- Evaluaciones IA procesadas en menos de **30 segundos**.  

---

## 📊 Beneficios del Sistema

✅ Transparencia en los procesos de selección  
✅ Evaluaciones objetivas mediante IA  
✅ Reducción de tiempo administrativo  
✅ Centralización de toda la información del talento humano  
✅ Experiencia de usuario moderna y accesible  

---

## 🧩 Instalación (Modo local)

```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/gesthum.git

# Backend (.NET)
cd backend
dotnet restore
dotnet run

# Frontend (React)
cd frontend
npm install
npm run dev
```

Abrir en navegador: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Pruebas y Evaluación

- Pruebas unitarias con **xUnit (.NET)** y **Jest (React)**.  
- Validación funcional de módulos mediante casos de uso definidos.  
- Evaluaciones automáticas simuladas con la API Gemini (modo sandbox).  

---

## 📚 Documentación Técnica

- Manual del Administrador (`/docs/Manual_Admin_GESTHUM_v1.pdf`)  
- Manual del Empleado (`/docs/Manual_Empleado_GESTHUM_v1.pdf`)  
- Guía Rápida (`/docs/Guia_Rapida_GESTHUM.pdf`)  
- Diagramas de arquitectura, casos de uso y modelo de datos (`/docs/diagramas/`)

---

## 🧾 Licencia

Proyecto académico desarrollado en la **Universidad de Costa Rica – Sede del Pacífico**,  
curso **IF-6100 Análisis y Diseño de Sistemas (II Semestre 2025)**.  
Licencia: **Uso educativo y demostrativo.**

---

> 💡 _GESTHUM representa la unión entre el talento humano y la tecnología: una plataforma donde la inteligencia artificial apoya la gestión del capital humano de manera ética, transparente y eficiente._
