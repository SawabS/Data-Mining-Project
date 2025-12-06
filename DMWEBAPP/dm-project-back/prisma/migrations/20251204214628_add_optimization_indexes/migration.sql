-- CreateIndex
CREATE INDEX `Accident_hour_dayOfWeek_idx` ON `Accident`(`hour`, `dayOfWeek`);

-- CreateIndex
CREATE INDEX `Accident_state_city_idx` ON `Accident`(`state`, `city`);

-- CreateIndex
CREATE INDEX `Accident_state_county_city_idx` ON `Accident`(`state`, `county`, `city`);

-- CreateIndex
CREATE INDEX `Accident_startLat_startLng_idx` ON `Accident`(`startLat`, `startLng`);

-- CreateIndex
CREATE INDEX `Accident_severity_idx` ON `Accident`(`severity`);

-- CreateIndex
CREATE INDEX `Accident_junction_idx` ON `Accident`(`junction`);

-- CreateIndex
CREATE INDEX `Accident_trafficSignal_idx` ON `Accident`(`trafficSignal`);

-- CreateIndex
CREATE INDEX `Accident_stop_idx` ON `Accident`(`stop`);

-- CreateIndex
CREATE INDEX `Accident_crossing_idx` ON `Accident`(`crossing`);

-- CreateIndex
CREATE INDEX `Accident_bump_idx` ON `Accident`(`bump`);
