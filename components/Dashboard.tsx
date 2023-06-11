import { useRouter } from 'next/router';
import React, { forwardRef, useCallback, useEffect } from 'react';
import { Chart, ChartData } from 'chart.js';
import { parseCookies } from 'nookies';
import { Attendance } from '@/models/Attendance';
import { ProgramForTeacher, Programs } from '@/models/Programs';
const Dashboard = () => {
  const cookies = parseCookies();
  useEffect(() => {
    var ctx2 = (
      document.getElementById('myChart2') as HTMLCanvasElement
    )?.getContext('2d');

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
    getInitialData();
  }, []);

  function setToMonday(date: Date) {
    var day = date.getDay() || 7;
    if (day !== 1) date.setHours(-24 * (day - 1));
    return date;
  }
  const currentWeekStart = setToMonday(new Date()).toDateString();

  const getInitialData = useCallback(async () => {
    const response = await fetch('/api/getAttendanceById', {
      method: 'POST',
      body: JSON.stringify({ teacherId: cookies.id })
    });
    const result = await response.json();
    const programResult = await fetch('/api/getProgramsForTeacher', {
      method: 'POST',
      body: JSON.stringify({ teacherId: cookies.id })
    });
    const programs = await programResult.json();
    if (result.result && programs.result) {
      var ctx = (
        document.getElementById('myChart') as HTMLCanvasElement
      ).getContext('2d');
      let initChart = {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              label: 'Sesssion 1 present',
              borderColor: 'rgb(109, 253, 181)',
              backgroundColor: 'rgb(109, 253, 181,0.5)',
              borderWidth: 2
            },
            {
              data: [],
              label: 'Session 2 present',
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgb(75, 192, 192,0.5)',
              borderWidth: 2
            },
            {
              data: [],
              label: 'Session 1 absent',
              borderColor: 'rgb(255, 205, 86)',
              backgroundColor: 'rgb(255, 205, 86,0.5)',
              borderWidth: 2
            },
            {
              data: [],
              label: 'Session 2 absent',
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgb(255, 99, 132,0.5)',
              borderWidth: 2
            }
          ]
        }
      } as Chart.ChartConfiguration;
      let initChart2 = structuredClone(initChart);
      const currentPrograms: string[] = [];

      const filteredData = result.result.filter(
        (a: Attendance) =>
          new Date(a.session_start_date).getTime() >
          setToMonday(new Date()).getTime()
      );

      filteredData.map((res: Attendance) => {
        // class name, session one or two,
        const programData = (programs.result as Programs[]).filter(
          (p) => p._id === res.program_data_id
        )[0];
        if (!currentPrograms.includes(programData._id)) {
          currentPrograms.push(programData._id);
          initChart.data?.labels?.push(programData?.program_name);
        }
        let presentNumber = 0;
        let absentNumber = 0;

        res.attendance_result.map((r) => {
          if (r.present) {
            presentNumber++;
          } else {
            absentNumber++;
          }
        });
        if (res.is_session_one && initChart.data?.datasets) {
          initChart.data?.datasets[0]?.data?.push(presentNumber);
          initChart.data?.datasets[2]?.data?.push(absentNumber);
        } else if (res.is_session_one === false && initChart.data?.datasets) {
          initChart.data?.datasets[1]?.data?.push(presentNumber);
          initChart.data?.datasets[3]?.data?.push(absentNumber);
        }
      });
      var myChart = ctx && new Chart(ctx, initChart);
    }
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
            <p className="ml-2 mb-2">Week start: {currentWeekStart}</p>
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
