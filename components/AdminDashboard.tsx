import { useRouter } from 'next/router';
import React, { forwardRef, useCallback, useEffect } from 'react';
import { Chart, ChartData } from 'chart.js';
import { parseCookies } from 'nookies';
import { Attendance } from '@/models/Attendance';
import { ProgramForTeacher, Programs } from '@/models/Programs';
import moment from 'moment';
const Dashboard = () => {
  const cookies = parseCookies();
  useEffect(() => {
    getInitialData();
  }, []);

  function setToMonday(date: Date) {
    var day = date.getDay() || 7;
    if (day !== 1) date.setHours(-24 * (day - 1));
    return date;
  }
  const currentWeekStart = setToMonday(new Date()).toDateString();
  /**
   * January 1st - March 31st  = First Quarter
   * April 1st - June 30th = Second Quarter
   * July 1st - September 30th = Third Quarter
   * October 1st - December 31st = Fourth Quarter
   */

  function getQuarter(date = new Date()) {
    return Math.floor(date.getMonth() / 3 + 1);
  }
  const currentQuarterStart = getQuarter(new Date());

  const quarterStartTimestamp = moment().startOf('quarter').toDate().getTime();
  const quarterEndTimestamp = moment().endOf('quarter').toDate().getTime();

  const getInitialData = useCallback(async () => {
    const response = await fetch('/api/getAllAttendaces', {
      method: 'GET'
    });
    const result = await response.json();
    const programResult = await fetch('/api/getAllPrograms', {
      method: 'GET'
    });
    const programs = await programResult.json();

    if (result.result && programs.result) {
      var ctx = (
        document.getElementById('myChart') as HTMLCanvasElement
      )?.getContext('2d');
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
              label: 'Session 1 absent',
              borderColor: 'rgb(255, 205, 86)',
              backgroundColor: 'rgb(255, 205, 86,0.5)',
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
              label: 'Session 2 absent',
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgb(255, 99, 132,0.5)',
              borderWidth: 2
            }
          ]
        }
      } as Chart.ChartConfiguration;
      let initQuarterChart = structuredClone(initChart);

      var ctx2 = (
        document.getElementById('myChart2') as HTMLCanvasElement
      )?.getContext('2d');

      const currentPrograms: string[] = [];

      const filteredData = result.result.filter(
        (a: Attendance) =>
          new Date(a.session_start_date).getTime() >
          setToMonday(new Date()).getTime()
      );

      const filteredQuarterly = result.result.filter(
        (a: Attendance) =>
          new Date(a.session_start_date).getTime() > quarterStartTimestamp &&
          new Date(a.session_start_date).getTime() < quarterEndTimestamp
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

          initChart.data?.datasets[1]?.data?.push(absentNumber);
        } else if (res.is_session_one === false && initChart.data?.datasets) {
          initChart.data?.datasets[2]?.data?.push(presentNumber);
          initChart.data?.datasets[3]?.data?.push(absentNumber);
        }
      });
      if (initChart.data?.datasets) {
        if (initChart.data?.datasets[0]?.data?.length === 0) {
          initChart.data?.datasets[0]?.data?.push(0);
        }
        if (initChart.data?.datasets[1]?.data?.length === 0) {
          initChart.data?.datasets[1]?.data?.push(0);
        }
        if (initChart.data?.datasets[2]?.data?.length === 0) {
          initChart.data?.datasets[2]?.data?.push(0);
        }
        if (initChart.data?.datasets[3]?.data?.length === 0) {
          initChart.data?.datasets[3]?.data?.push(0);
        }
      }
      const currentQuarterPrograms: string[] = [];
      filteredQuarterly.map((res: Attendance) => {
        // class name, session one or two,
        const programData = (programs.result as Programs[]).filter(
          (p) => p._id === res.program_data_id
        )[0];
        if (!currentQuarterPrograms.includes(programData._id)) {
          currentQuarterPrograms.push(programData._id);
          initQuarterChart.data?.labels?.push(programData?.program_name);
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
        if (res.is_session_one && initQuarterChart.data?.datasets) {
          initQuarterChart.data?.datasets[0]?.data?.push(presentNumber);

          initQuarterChart.data?.datasets[1]?.data?.push(absentNumber);
        } else if (
          res.is_session_one === false &&
          initQuarterChart.data?.datasets
        ) {
          initQuarterChart.data?.datasets[2]?.data?.push(presentNumber);
          initQuarterChart.data?.datasets[3]?.data?.push(absentNumber);
        }
      });
      if (initQuarterChart.data?.datasets) {
        if (initQuarterChart.data?.datasets[0]?.data?.length === 0) {
          initQuarterChart.data?.datasets[0]?.data?.push(0);
        }
        if (initQuarterChart.data?.datasets[1]?.data?.length === 0) {
          initQuarterChart.data?.datasets[1]?.data?.push(0);
        }
        if (initQuarterChart.data?.datasets[2]?.data?.length === 0) {
          initQuarterChart.data?.datasets[2]?.data?.push(0);
        }
        if (initQuarterChart.data?.datasets[3]?.data?.length === 0) {
          initQuarterChart.data?.datasets[3]?.data?.push(0);
        }
      }

      var myChart = ctx && new Chart(ctx, initChart);
      var myChart = ctx2 && new Chart(ctx2, initQuarterChart);
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
            <p className="ml-2 mb-2">Current Quarter: Q{currentQuarterStart}</p>
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
