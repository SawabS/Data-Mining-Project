# 🚗 US Accidents Data Mining Project

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.x-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E.svg?logo=nestjs&logoColor=white)](https://nestjs.com)
[![Python](https://img.shields.io/badge/Python-3.x-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript&logoColor=white)](https://typescriptlang.org)

**A comprehensive data mining and visualization platform for analyzing 7.7 million US traffic accident records.**

[Overview](#-overview) • [Features](#-features) • [Tech Stack](#-technology-stack) • [Setup Guide](#-installation--setup) • [Documentation](#-documentation)

</div>

---

## 🎯 Overview

This project represents a complete end-to-end data mining solution, transforming raw traffic accident data into actionable insights. By leveraging a modern full-stack architecture alongside robust data science pipelines, we provide a powerful interface for exploring patterns in accident severity, weather conditions, and geographic distribution across the United States (2016-2023).

The system processes **7.7 million records** through a memory-efficient cleaning pipeline and serves them via a high-performance REST API to an interactive React-based dashboard.

## ✨ Features

### 🔬 Data Science Pipeline

- **Memory-Efficient Processing**: Chunked loading strategies to handle multi-gigabyte datasets on standard hardware.
- **Advanced Imputation**: Context-aware missing value treatment using statistical mean/mode and domain-specific logic.
- **Outlier Detection**: Statistical range validation for meteorological and geographical data points.
- **Temporal Analysis**: Extraction of cyclic patterns (daily, weekly, seasonal) from timestamp data.

### 💻 Interactive Web Application

- **Geospatial Intelligence**:
  - **Hexbin Maps**: Density visualization of accidents across the US.
  - **Regional Treemaps**: Hierarchical drill-down into state and county-level data.
- **Multivariate Analysis**:
  - **Parallel Coordinates**: Explore correlations between weather, severity, and time.
  - **Temporal Heatmaps**: Visualize high-risk time windows.
  - **POI Impact**: Analyze how traffic signals, junctions, and crossings affect accident severity.
- **Dynamic Filtering**: Real-time data slicing by state, severity level, weather condition, and time range.

## 🛠️ Technology Stack

### 🧠 Data Science & Analysis

| Category          | Technologies                                                                                                                                                                                                                                                                                                                      |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core**          | ![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white) ![Pandas](https://img.shields.io/badge/Pandas-150458?logo=pandas&logoColor=white) ![NumPy](https://img.shields.io/badge/NumPy-013243?logo=numpy&logoColor=white) ![SciPy](https://img.shields.io/badge/SciPy-8CAAE6?logo=scipy&logoColor=white) |
| **Visualization** | ![Matplotlib](https://img.shields.io/badge/Matplotlib-11557c?logo=python&logoColor=white) ![Seaborn](https://img.shields.io/badge/Seaborn-3776AB?logo=python&logoColor=white)                                                                                                                                                     |
| **Environment**   | ![Jupyter](https://img.shields.io/badge/Jupyter-F37626?logo=jupyter&logoColor=white) ![Anaconda](https://img.shields.io/badge/Anaconda-44A833?logo=anaconda&logoColor=white)                                                                                                                                                      |

### 🎨 Frontend (Client)

| Category          | Technologies                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**     | ![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)                                                                                                                   |
| **State & Data**  | ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white) ![Zustand](https://img.shields.io/badge/Zustand-433D37?logo=react&logoColor=white) ![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white)                                                                                                       |
| **UI / UX**       | ![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white) ![Radix UI](https://img.shields.io/badge/Radix_UI-161618?logo=radix-ui&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=white) ![Lucide](https://img.shields.io/badge/Lucide_Icons-F56565?logo=lucide&logoColor=white) |
| **Visualization** | ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?logo=react&logoColor=white) ![Leaflet](https://img.shields.io/badge/Leaflet-199900?logo=leaflet&logoColor=white) ![D3.js](https://img.shields.io/badge/D3.js-F9A03C?logo=d3.js&logoColor=white)                                                                                                                      |
| **Forms**         | ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white) ![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)                                                                                                                                                                                           |

### ⚙️ Backend (Server)

| Category      | Technologies                                                                                                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Runtime**   | ![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)                                                                                                                  |
| **Framework** | ![NestJS](https://img.shields.io/badge/NestJS_10-E0234E?logo=nestjs&logoColor=white) ![RxJS](https://img.shields.io/badge/RxJS-B7178C?logo=rxjs&logoColor=white)                          |
| **Database**  | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?logo=prisma&logoColor=white)                      |
| **Utilities** | ![Day.js](https://img.shields.io/badge/Day.js-FB6052?logo=javascript&logoColor=white) ![Class Validator](https://img.shields.io/badge/Class_Validator-E0234E?logo=nestjs&logoColor=white) |

## 📂 Project Structure

```
Data-Mining-Project/
├── 📂 data/                           # Dataset Storage
│   ├── 📂 raw/                        # Original CSV files (US_Accidents_March23.csv)
│   └── 📂 processed/                  # Cleaned datasets & quality artifacts
│       └── artifacts/                 # Generated reports (JSON/CSV profiles)
│
├── 📂 notebooks/                      # Data Science Environment
│   ├── dataset_cleaning.ipynb         # 🧹 Main cleaning pipeline
│   ├── dataset_exploration.ipynb      # 📊 EDA & Statistical Analysis
│   └── 📂 auxiliary_notebooks/        # Experimental & support notebooks
│
├── 📂 DMWEBAPP/                       # Web Application Monorepo
│   ├── 📂 Sawab-project-back/         # 🟢 NestJS Backend API
│   │   ├── src/accident/              # Accident domain logic
│   │   └── prisma/                    # Database schema & migrations
│   │
│   └── 📂 Sawab-project-front/        # 🔵 React Frontend Client
│       ├── src/components/charts/     # Visualization components
│       ├── src/pages/                 # Route pages
│       └── src/hooks/                 # Custom React hooks
│
└── README.md                          # Project Documentation
```

## 🚀 Installation & Setup

Follow this comprehensive guide to set up the project from scratch.

### 0. Prerequisites

Ensure your environment meets these requirements:

- **Node.js** (v18+) or **Bun** (v1.0+)
- **Python** (v3.8+) with Pip
- **MySQL Server** (v8.0+)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/SawabS/Data-Mining-Project.git
cd Data-Mining-Project
```

### 2. Data Pipeline Setup

1. **Download Data**: Get `US_Accidents_March23.csv` from [Kaggle](https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents) and place it in `data/raw/`.
2. **Install Python Libs**:
   ```bash
   pip install pandas numpy matplotlib seaborn scipy jupyter
   ```
3. **Run Cleaning**:
   - Open `notebooks/dataset_cleaning.ipynb` in Jupyter.
   - Execute all cells to generate `data/processed/US_Accidents_Cleaned.csv`.

### 3. Backend Configuration

```bash
cd DMWEBAPP/Sawab-project-back
```

1. **Install Dependencies**:
   ```bash
   bun install
   ```
2. **Environment Setup**:
   Create a `.env` file:
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/accident_db"
   PORT=3000
   ```
3. **Database Init**:
   ```bash
   bunx prisma migrate dev --name init
   ```
4. **Launch Server**:
   ```bash
   bun run dev
   ```

### 4. Frontend Configuration

Open a new terminal:

```bash
cd DMWEBAPP/Sawab-project-front
```

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Launch Client**:
   ```bash
   npm run dev
   ```
   > Access the application at `http://localhost:5173`

## 🎓 Academic Context

**Institution**: American University of Kurdistan (AUK)  
**Course**: Data Mining (Fall 2025)  
**Project Type**: Final Capstone Project

This project demonstrates the practical application of data mining techniques—from raw data preprocessing and statistical analysis to the development of a user-facing analytical tool.

---

<div align="center">
  <sub>Built with ❤️ by the Data Mining Course Team</sub>
</div>
