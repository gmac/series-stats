series-stats
============

Numeric series statistics algorithms and utility methods. Useful for data visualization an choropleth mapping, specifically for breaking up a series of numbers into legend ranges.

#Series API

**equalBreaks** `Series.equalBreaks( [series], classes );`  
Accepts a numeric series (array) and a number of classes to create. Returns an array of equally-sized class breaks distributed evenly across the range of series values. Example:

	Series.equalBreaks([10, 55, 87, 63, 27, 36, 23, 71, 29, 45, 2, 83, 17], 4);
	// >> [2, 23.25, 44.5, 65.75, 87]

**quantileBreaks** `Series.quantileBreaks( [series], classes );`  
Returns an array of unevenly-sized classes distributed at even intervals across the series of values. Example:

	Series.quantileBreaks([10, 55, 87, 63, 27, 36, 23, 71, 29, 45, 2, 83, 17], 4);
	// >> [2, 23, 36, 63, 87]

**jenksBreaks** `Series.jenksBreaks( [series], classes );`  
Returns an array of unevenly-sized classes distributed at uneven intervals across the series of values. Breaks are algorithmically plotted around concentrations of values within the series. Tends to minimizes the impact of outlier values on the outskirts of the series. Example:

	Series.jenksBreaks([10, 55, 87, 63, 27, 36, 23, 71, 29, 45, 2, 83, 17], 4);
	// >> [2, 17, 36, 63, 87]

**plot** `Series.plot( [breaks], value, descending? );`  
Plots a value's position within a breaks series.

**sort** `Series.sort( [series], descending? );`  
Performs a numeric sort on the series array.

**min** `Series.min( [series] );`  
Finds the minimum value within a series array.

**max** `Series.max( [series] );`  
Finds the maximum value within a series array.

**sum** `Series.sum( [series] );`  
Calculates the sum (total) of a series array.

**mean** `Series.mean( [series] );`  
Calculates the mean (average) of a series array.