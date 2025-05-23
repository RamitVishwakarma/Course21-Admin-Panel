import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import DatePicker from './DatePicker';
import { ApexOptions } from 'apexcharts';
import { useToast } from '@/components/ui/use-toast';
import { useAnalyticsStore } from '@/store/useAnalyticsStore';

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
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
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2],
    curve: 'smooth',
  },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'category',
    categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      rotate: -45,
      formatter: (value: string) => value,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 0,
    max: 30000,
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
  categories: string[];
}

const ChartOne: React.FC = () => {
  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: 'Total Sales',
        data: [],
      },
    ],
    categories: [],
  });

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { toast } = useToast();

  // Get data and functions from our analytics store
  const { data, fetchChartData, isLoading } = useAnalyticsStore((state) => ({
    data: state.data,
    fetchChartData: state.fetchChartData,
    isLoading: state.isLoading,
  }));

  useEffect(() => {
    // Fetch chart data from our store
    fetchChartData();
  }, [fetchChartData]);

  useEffect(() => {
    if (data.revenueGrowthData.length > 0 && !isLoading) {
      // Filter data based on date range if provided
      let filteredData = [...data.revenueGrowthData];

      if (startDate || endDate) {
        // In a real app, we would filter based on dates
        // For demo purposes, we'll just use a subset of the dummy data
        const startIndex = startDate ? Math.floor(Math.random() * 3) : 0;
        const endIndex = endDate
          ? startIndex + Math.floor(Math.random() * 6) + 3
          : filteredData.length;
        filteredData = filteredData.slice(startIndex, endIndex);
      }

      setState({
        series: [
          {
            name: 'Total Revenue',
            data: filteredData.map((entry) => entry.revenue),
          },
        ],
        categories: filteredData.map((entry) => entry.name),
      });
    }
  }, [data.revenueGrowthData, startDate, endDate, isLoading]);

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5 shadow-md px-2 rounded-md">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="flex gap-4   ">
              <div className="w-max">
                <p className="font-semibold text-primary">Total Revenue</p>
                <p className="text-sm font-medium">
                  {startDate && endDate
                    ? `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
                    : 'Select a Date Range'}
                </p>
              </div>
              <div className="mb-4">
                <DatePicker
                  onStartDateChange={(date) => setStartDate(date)}
                  onEndDateChange={(date) => setEndDate(date)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={{
              ...options,
              xaxis: {
                ...options.xaxis,
                categories: state.categories,
              },
              yaxis: {
                ...options.yaxis,
                max: Math.max(...state.series[0].data) * 1.2 || 30000,
              },
            }}
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
