import { useRouter } from 'next/router';
import React, { forwardRef, useEffect } from 'react';
import { Chart } from 'chart.js';
const Dashboard = () => {
  useEffect(() => {
    var ctx = (
      document.getElementById('myChart') as HTMLCanvasElement
    ).getContext('2d');
    var ctx2 = (
      document.getElementById('myChart2') as HTMLCanvasElement
    )?.getContext('2d');
    var myChart =
      ctx &&
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
          ],
          datasets: [
            {
              data: [66, 144, 146, 116, 107, 131, 43],
              label: 'Applied',
              borderColor: 'rgb(109, 253, 181)',
              backgroundColor: 'rgb(109, 253, 181,0.5)',
              borderWidth: 2
            },
            {
              data: [40, 100, 44, 70, 63, 30, 10],
              label: 'Accepted',
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgb(75, 192, 192,0.5)',
              borderWidth: 2
            },
            {
              data: [20, 24, 50, 34, 33, 23, 12],
              label: 'Pending',
              borderColor: 'rgb(255, 205, 86)',
              backgroundColor: 'rgb(255, 205, 86,0.5)',
              borderWidth: 2
            },
            {
              data: [6, 20, 52, 12, 11, 78, 21],
              label: 'Rejected',
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgb(255, 99, 132,0.5)',
              borderWidth: 2
            }
          ]
        }
      });
    var myChart =
      ctx2 &&
      new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
          ],
          datasets: [
            {
              data: [66, 144, 146, 116, 107, 131, 43],
              label: 'Applied',
              borderColor: 'rgb(109, 253, 181)',
              backgroundColor: 'rgb(109, 253, 181,0.5)',
              borderWidth: 2
            },
            {
              data: [40, 100, 44, 70, 63, 30, 10],
              label: 'Accepted',
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgb(75, 192, 192,0.5)',
              borderWidth: 2
            },
            {
              data: [20, 24, 50, 34, 33, 23, 12],
              label: 'Pending',
              borderColor: 'rgb(255, 205, 86)',
              backgroundColor: 'rgb(255, 205, 86,0.5)',
              borderWidth: 2
            },
            {
              data: [6, 20, 52, 12, 11, 78, 21],
              label: 'Rejected',
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgb(255, 99, 132,0.5)',
              borderWidth: 2
            }
          ]
        }
      });
  }, []);
  return (
    <div className="  overflow-x-hidden border-t flex flex-col ">
      <main className="w-full flex-grow p-6">
        <h1 className="text-3xl text-black pb-6">Dashboard</h1>

        <div className="flex flex-wrap mt-6">
          <div className="w-full lg:w-1/2 pr-0 lg:pr-2">
            <p className="text-xl pb-3 flex items-center">
              <i className="fa-solid fa-chart-column mr-3"></i>
              Weekly Engagements
            </p>
            <div className="p-6 bg-white ">
              <div className="border border-gray-400 pt-0 rounded-xl    h-fit    shadow-xl">
                <canvas id="myChart"></canvas>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 pl-0 lg:pl-2 mt-12 lg:mt-0">
            <p className="text-xl pb-3 flex items-center">
              <i className="fa-solid fa-chart-column mr-3"></i> Quarterly
              Engagements
            </p>
            <div className="p-6 bg-white ">
              <div className="border border-gray-400 pt-0 rounded-xl    h-fit    shadow-xl">
                <canvas id="myChart2"></canvas>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
