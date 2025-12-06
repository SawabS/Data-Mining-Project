-- CreateIndex
CREATE INDEX `Accident_state_startLat_startLng_idx` ON `Accident`(`state`, `startLat`, `startLng`);

-- CreateIndex
CREATE INDEX `Accident_year_month_idx` ON `Accident`(`year`, `month`);
