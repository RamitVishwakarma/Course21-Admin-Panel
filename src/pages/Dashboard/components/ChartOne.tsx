import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface ChartData {
  userGrowth: { label: string; value: number }[];
  revenueGrowth: { label: string; value: number }[];
}

interface ChartOneProps {
  chartData?: ChartData | null;
}

interface ChartOneState {
  series: { name: string; data: number[] }[];
  categories: string[];
}

const options: ApexOptions = {
  legend: { show: false, position: 'top', horizontalAlign: 'left' },
  colors: ['#3C50E0', '#80CAEE'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: { show: false },
  },
  responsive: [
    { breakpoint: 1024, options: { chart: { height: 300 } } },
    { breakpoint: 1366, options: { chart: { height: 350 } } },
  ],
  stroke: { width: [2, 2], curve: 'straight' },
  grid: { xaxis: { lines: { show: true } }, yaxis: { lines: { show: true } } },
  dataLabels: { enabled: false },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: { size: undefined, sizeOffset: 5 },
  },
  xaxis: {
    type: 'category',
    categories: [],
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    title: { style: { fontSize: '0px' } },
    min: 0,
    // Remove max limit to allow dynamic scaling
  },
};

const ChartOne: React.FC<ChartOneProps> = ({ chartData }) => {
  const [state, setState] = useState<ChartOneState>({
    series: [
      { name: 'Users', data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45] },
      {
        name: 'Revenue (K)',
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
      },
    ],
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
  });

  useEffect(() => {
    console.log('ChartOne received chartData:', chartData);

    if (chartData && chartData.userGrowth && chartData.revenueGrowth) {
      // Check if we have valid data
      if (
        chartData.userGrowth.length > 0 &&
        chartData.revenueGrowth.length > 0
      ) {
        const newState = {
          series: [
            {
              name: 'Users',
              data: chartData.userGrowth.map((item) => item.value) || [],
            },
            {
              name: 'Revenue (K)',
              data:
                chartData.revenueGrowth.map((item) =>
                  Math.floor(item.value / 1000),
                ) || [],
            },
          ],
          categories: chartData.userGrowth.map((item) => item.label) || [],
        };

        console.log('ChartOne updating state with:', newState);
        setState(newState);
      }
    } else {
      console.log('ChartOne: No valid chartData, using default sample data');
    }
    // If no chartData or empty data, keep default sample data for demo
  }, [chartData]);

  const optionsWithCategories = {
    ...options,
    xaxis: { ...options.xaxis, categories: state.categories },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Users</p>
              <p className="text-sm font-medium">Monthly Growth</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Revenue</p>
              <p className="text-sm font-medium">Monthly Revenue</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={optionsWithCategories}
            series={state.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
