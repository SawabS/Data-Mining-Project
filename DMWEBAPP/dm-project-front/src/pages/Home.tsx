import { useState } from "react";
import { TemporalHeatmap } from "@/components/charts/TemporalHeatmap";
import { HexbinMap } from "@/components/charts/HexbinMap";
import { ParallelCoordinatesPlot } from "@/components/charts/ParallelCoordinatesPlot";
import { RegionalTreemap } from "@/components/charts/RegionalTreemap";
import { POIStackedBarChart } from "@/components/charts/POIStackedBarChart";
import Search from "@/components/shared/Search";
import { AccidentsTable } from "@/components/table/AccidentsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GlobalTimeFilters } from "@/components/shared/GlobalTimeFilters";
import {
  MapIcon,
  Clock,
  CloudSun,
  BarChart3,
  MapPinned,
  FileText,
} from "lucide-react";

const Home = () => {
  const [activeTab, setActiveTab] = useState("geospatial");

  return (
    <section className="w-full min-h-screen p-6 md:p-10 space-y-8 bg-[var(--background)]">
      {/* Dashboard Header */}
      <div className="text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-bold text-[var(--cta)] drop-shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          US Traffic Accidents Analytics
        </h1>
        <p className="text-[var(--muted)] max-w-2xl mx-auto text-base md:text-lg animate-in fade-in duration-700 delay-300">
          Explore traffic accident patterns across the United States with
          interactive visualizations for spatial, temporal, weather, and
          infrastructure analysis.
        </p>
      </div>

      {/* Global Time Filters */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
        <GlobalTimeFilters />
      </div>

      {/* Visualization Tabs - Data loads only when tab is selected */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto gap-2 bg-[var(--card_full_white)] p-2 rounded-xl border border-[var(--border-color)] shadow-sm">
            <TabsTrigger
              value="geospatial"
              className="flex items-center gap-2 text-xs md:text-sm data-[state=active]:bg-[var(--cta)] data-[state=active]:text-white data-[state=active]:shadow-md text-[var(--muted)] hover:text-[var(--text)] transition-all duration-200"
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Geospatial</span>
            </TabsTrigger>
            <TabsTrigger
              value="temporal"
              className="flex items-center gap-2 text-xs md:text-sm data-[state=active]:bg-[var(--primary_girl)] data-[state=active]:text-white data-[state=active]:shadow-md text-[var(--muted)] hover:text-[var(--text)] transition-all duration-200"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Temporal</span>
            </TabsTrigger>
            <TabsTrigger
              value="weather"
              className="flex items-center gap-2 text-xs md:text-sm data-[state=active]:bg-[var(--primary_boy)] data-[state=active]:text-white data-[state=active]:shadow-md text-[var(--muted)] hover:text-[var(--text)] transition-all duration-200"
            >
              <CloudSun className="w-4 h-4" />
              <span className="hidden sm:inline">Weather</span>
            </TabsTrigger>
            <TabsTrigger
              value="regional"
              className="flex items-center gap-2 text-xs md:text-sm data-[state=active]:bg-[var(--success)] data-[state=active]:text-white data-[state=active]:shadow-md text-[var(--muted)] hover:text-[var(--text)] transition-all duration-200"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Regional</span>
            </TabsTrigger>
            <TabsTrigger
              value="poi"
              className="flex items-center gap-2 text-xs md:text-sm data-[state=active]:bg-[var(--warning)] data-[state=active]:text-white data-[state=active]:shadow-md text-[var(--muted)] hover:text-[var(--text)] transition-all duration-200"
            >
              <MapPinned className="w-4 h-4" />
              <span className="hidden sm:inline">POI Impact</span>
            </TabsTrigger>
          </TabsList>

          {/* Task 1: Geospatial Hotspot Analysis */}
          <TabsContent
            value="geospatial"
            className="mt-6 animate-in fade-in slide-in-from-right-4 duration-300"
          >
            {activeTab === "geospatial" && <HexbinMap />}
          </TabsContent>

          {/* Task 2: Temporal Cyclicality Assessment */}
          <TabsContent
            value="temporal"
            className="mt-6 animate-in fade-in slide-in-from-right-4 duration-300"
          >
            {activeTab === "temporal" && <TemporalHeatmap />}
          </TabsContent>

          {/* Task 3: Multivariate Weather Correlation */}
          <TabsContent
            value="weather"
            className="mt-6 animate-in fade-in slide-in-from-right-4 duration-300"
          >
            {activeTab === "weather" && <ParallelCoordinatesPlot />}
          </TabsContent>

          {/* Task 4: Hierarchical Regional Decomposition */}
          <TabsContent
            value="regional"
            className="mt-6 animate-in fade-in slide-in-from-right-4 duration-300"
          >
            {activeTab === "regional" && <RegionalTreemap />}
          </TabsContent>

          {/* Task 5: Point of Interest Impact Analysis */}
          <TabsContent
            value="poi"
            className="mt-6 animate-in fade-in slide-in-from-right-4 duration-300"
          >
            {activeTab === "poi" && <POIStackedBarChart />}
          </TabsContent>
        </Tabs>
      </div>

      {/* Accidents List */}
      <div className="mt-12 pt-8 border-t border-[var(--border-color)] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-[var(--cta)]" />
          <h2 className="text-2xl font-bold text-[var(--on-white-text)]">
            Accident Records
          </h2>
        </div>
        <Search />
        <AccidentsTable />
      </div>
    </section>
  );
};

export default Home;
