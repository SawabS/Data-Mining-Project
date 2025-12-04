# 🚗 US Accidents Data Mining Project

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.x-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-19.x-61DAFB.svg)](https://react.dev)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E.svg)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://typescriptlang.org)

> A comprehensive data mining and visualization platform for analyzing US traffic accidents (7.7M records). Features an interactive web application with geospatial visualizations, temporal analysis, and advanced data exploration tools.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Dataset](#-dataset)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Notebooks](#-notebooks)
- [Web Application](#-web-application)
- [Documentation](#-documentation)
- [Academic Context](#-academic-project)

## 🎯 Overview

This project provides end-to-end data mining analysis of US traffic accidents, combining:

- **Data Pipeline**: Comprehensive cleaning and preprocessing of 7.7M accident records
- **Exploratory Analysis**: Statistical analysis, correlation studies, and pattern discovery
- **Interactive Web App**: Full-stack application for real-time data exploration and visualization
- **Geospatial Analysis**: Map-based visualizations including hexbin maps and regional treemaps

## ✨ Features

### Data Analysis

- ✅ Automated data cleaning pipeline with memory-efficient chunking
- ✅ Missing value treatment (mean/mode imputation strategies)
- ✅ Datetime conversion and validation
- ✅ Range and sanity checks for numerical features
- ✅ Statistical profiling and correlation analysis

### Web Application

- 🗺️ **Hexbin Map** - Geospatial density visualization of accidents
- 📊 **Temporal Heatmap** - Time-based accident pattern analysis
- 📈 **Parallel Coordinates Plot** - Multi-dimensional data exploration
- 🌳 **Regional Treemap** - Hierarchical geographic breakdown
- 📉 **POI Stacked Bar Chart** - Points of interest impact analysis
- 🔍 **Advanced Filtering** - Dynamic data querying and exploration

## 📊 Dataset

| Property          | Details                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Source**        | [US Accidents Dataset on Kaggle](https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents)                      |
| **Records**       | 7.7 Million accident records                                                                                      |
| **Features**      | 46 original features                                                                                              |
| **Time Period**   | 2016-2023                                                                                                         |
| **Coverage**      | All US states                                                                                                     |
| **Clean Dataset** | [Download from Google Drive](https://drive.google.com/file/d/1iXnZ6impD9DoPduDvE5a_u5a5iWKjux0/view?usp=drivesdk) |

### Key Features in Dataset

- **Location**: Latitude, Longitude, Street, City, County, State, Zipcode
- **Time**: Start/End Time, Weather Timestamp, Timezone
- **Weather**: Temperature, Humidity, Pressure, Visibility, Wind Speed/Direction
- **Severity**: Accident severity levels (1-4)
- **POI Indicators**: Traffic signals, crossings, junctions, railway, etc.
- **Light Conditions**: Sunrise/Sunset, Civil/Nautical/Astronomical Twilight

## 🛠️ Technology Stack

### Data Science & Analysis

| Technology                                                                                      | Purpose                           |
| ----------------------------------------------------------------------------------------------- | --------------------------------- |
| ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)    | Core programming language         |
| ![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat&logo=pandas&logoColor=white)    | Data manipulation and analysis    |
| ![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat&logo=numpy&logoColor=white)       | Numerical computing               |
| ![Matplotlib](https://img.shields.io/badge/Matplotlib-11557c?style=flat)                        | Data visualization                |
| ![Seaborn](https://img.shields.io/badge/Seaborn-3776AB?style=flat)                              | Statistical visualizations        |
| ![SciPy](https://img.shields.io/badge/SciPy-8CAAE6?style=flat&logo=scipy&logoColor=white)       | Scientific computing & statistics |
| ![Jupyter](https://img.shields.io/badge/Jupyter-F37626?style=flat&logo=jupyter&logoColor=white) | Interactive notebooks             |

### Frontend (React Application)

| Technology                                                                                                            | Purpose                     |
| --------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)                          | UI framework                |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)              | Type-safe JavaScript        |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)                                | Build tool & dev server     |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)          | Utility-first CSS framework |
| ![Radix UI](https://img.shields.io/badge/Radix_UI-161618?style=flat)                                                  | Accessible UI components    |
| ![React Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat&logo=reactquery&logoColor=white)         | Server state management     |
| ![Zustand](https://img.shields.io/badge/Zustand-433D37?style=flat)                                                    | Client state management     |
| ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat)                                                  | Chart library               |
| ![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=flat&logo=leaflet&logoColor=white)                       | Interactive maps            |
| ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat&logo=reacthookform&logoColor=white) | Form handling               |
| ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat)                                                            | Schema validation           |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)            | Animations                  |

### Backend (NestJS API)

| Technology                                                                                               | Purpose               |
| -------------------------------------------------------------------------------------------------------- | --------------------- |
| ![NestJS](https://img.shields.io/badge/NestJS_10-E0234E?style=flat&logo=nestjs&logoColor=white)          | Backend framework     |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) | Type-safe development |
| ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)             | Database ORM          |
| ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)                | Relational database   |
| ![Bun](https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white)                      | JavaScript runtime    |

### DevOps & Tools

| Technology                                                                                         | Purpose             |
| -------------------------------------------------------------------------------------------------- | ------------------- |
| ![Git](https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white)                | Version control     |
| ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)       | Code linting        |
| ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=black) | Code formatting     |
| ![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)    | Frontend deployment |

## 📁 Project Structure

```
Data-Mining-Project/
├── 📂 data/
│   ├── raw/                           # Original dataset samples
│   │   └── sample_dataset_5k.csv      # 5K record sample for testing
│   └── processed/                     # Cleaned data + quality reports
│       ├── US_Accidents_Cleaned.csv   # Cleaned dataset
│       └── artifacts/                 # Data quality reports
│           ├── 01_schema_overview.csv
│           ├── 02_datetime_inference.csv
│           ├── 03_missingness_columns.csv
│           ├── 04_range_checks.csv
│           ├── 05_year_month_counts.csv
│           ├── 06_categorical_profile.json
│           ├── 07_numeric_profile.csv
│           ├── 09_text_profile.csv
│           └── 10_spearman_corr.csv
│
├── 📂 notebooks/
│   ├── dataset_cleaning.ipynb         # Main data cleaning pipeline
│   ├── dataset_exploration.ipynb      # EDA and statistical analysis
│   ├── artifacts/                     # Notebook outputs
│   └── auxiliary_notebooks/           # Supporting notebooks
│       ├── Group_Project_cleaning.ipynb
│       ├── sample_cleaned_dataset.ipynb
│       └── sample_raw_dataset.ipynb
│
├── 📂 DMWEBAPP/
│   ├── 📂 Sawab-project-back/         # NestJS Backend API
│   │   ├── src/
│   │   │   ├── main.ts                # Application entry point
│   │   │   ├── app.module.ts          # Root module
│   │   │   ├── accident/              # Accident API module
│   │   │   │   ├── accident.controller.ts
│   │   │   │   ├── accident.service.ts
│   │   │   │   └── accident.module.ts
│   │   │   ├── common/                # Shared utilities & filters
│   │   │   └── types/                 # TypeScript definitions
│   │   ├── prisma/
│   │   │   ├── schema.prisma          # Database schema
│   │   │   └── migrations/            # Database migrations
│   │   └── lib/                       # Shared libraries
│   │
│   └── 📂 Sawab-project-front/        # React Frontend Application
│       ├── src/
│       │   ├── App.tsx                # Main application component
│       │   ├── components/
│       │   │   ├── charts/            # Visualization components
│       │   │   │   ├── HexbinMap.tsx
│       │   │   │   ├── TemporalHeatmap.tsx
│       │   │   │   ├── ParallelCoordinatesPlot.tsx
│       │   │   │   ├── RegionalTreemap.tsx
│       │   │   │   └── POIStackedBarChart.tsx
│       │   │   ├── ui/                # Reusable UI components
│       │   │   └── shared/            # Shared components
│       │   ├── pages/                 # Application pages
│       │   ├── hooks/                 # Custom React hooks
│       │   ├── lib/                   # Utilities & configuration
│       │   └── routes/                # Routing configuration
│       └── public/                    # Static assets
│
├── LICENSE
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.x** - For data analysis notebooks
- **Node.js 18+** or **Bun** - For web application
- **MySQL** - For database

### Data Analysis Setup

```bash
# Install Python dependencies
pip install pandas numpy matplotlib seaborn scipy jupyter

# Run Jupyter notebooks
jupyter notebook notebooks/
```

### Backend Setup

```bash
cd DMWEBAPP/Sawab-project-back

# Install dependencies
bun install

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run database migrations
bunx prisma migrate dev

# Start development server
bun run dev
```

### Frontend Setup

```bash
cd DMWEBAPP/Sawab-project-front

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📚 Notebooks

| Notebook                    | Description                                                                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `dataset_cleaning.ipynb`    | Complete data cleaning pipeline with memory-efficient chunking, missing value treatment, duplicate removal, and range validation |
| `dataset_exploration.ipynb` | Comprehensive EDA including schema audit, statistical profiling, correlation analysis, and visualization generation              |
| `auxiliary_notebooks/`      | Supporting notebooks for sample analysis and collaborative work                                                                  |

### Cleaning Pipeline Steps

1. **Data Loading** - Memory-safe chunked loading for 7.7M records
2. **Initial Audit** - Missing values overview and data quality assessment
3. **Datetime Conversion** - Parse and validate temporal columns
4. **Duplicate Removal** - Identify and remove duplicate records
5. **Missing Value Treatment** - Mean imputation (numerical), Mode imputation (categorical)
6. **Column Pruning** - Drop high-missingness columns (End_Lat, End_Lng, Wind_Chill, Precipitation)
7. **Range Validation** - Sanity checks for geographical and meteorological features

## 🌐 Web Application

The interactive web application provides real-time exploration of accident data through multiple visualization types:

### Visualizations

| Chart                    | Description                                              |
| ------------------------ | -------------------------------------------------------- |
| **Hexbin Map**           | Geographic density visualization using hexagonal binning |
| **Temporal Heatmap**     | Hour-of-day vs day-of-week accident frequency patterns   |
| **Parallel Coordinates** | Multi-dimensional exploration of accident features       |
| **Regional Treemap**     | Hierarchical view of accidents by state/county           |
| **POI Bar Chart**        | Impact analysis of points of interest on accidents       |

### API Endpoints

The NestJS backend provides RESTful APIs for:

- Accident data retrieval with filtering
- Aggregation queries for visualizations
- Geospatial queries for map-based views

## 📄 Documentation

- **Cleaning Report**: `DM_Cleaning_Report.pdf` - Detailed data quality analysis and cleaning methodology
- **Data Artifacts**: Quality reports and profiling outputs in `data/processed/artifacts/`
- **API Documentation**: Available at `/api` endpoint when backend is running

## 🎓 Academic Project

**Institution**: American University of Kurdistan (AUK)  
**Course**: Data Mining  
**Focus Areas**:

- Real-world large-scale data preprocessing
- Statistical analysis and pattern discovery
- Data visualization and interactive exploration
- Full-stack web application development

---

<div align="center">

**Data Mining Course Project - American University of Kurdistan**

Made with ❤️ by the project team

</div>
