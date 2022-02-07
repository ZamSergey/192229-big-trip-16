import dayjs from 'dayjs';
import SmartView from './smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {countMoneyForEachEvent, countSameEvent, countTimeEvent} from '../utils/statistics';
import {EVENT_TYPES} from '../utils/const';

import {countCompletedTaskInDateRange} from '../utils/statistics.js';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createStatsTemplate = () => (
  `<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item">
  <canvas class="statistics__chart" id="money" width="900"></canvas>
  </div>

  <div class="statistics__item">
  <canvas class="statistics__chart" id="type" width="900"></canvas>
  </div>

  <div class="statistics__item">
  <canvas class="statistics__chart" id="time" width="900"></canvas>
  </div>
  </section>`
);


export default class StatsView extends SmartView {
  #datepicker = null;
  #moneyChart = null;
  #timeChart = null;
  #typeChart = null;
  #countMoneyData = null;
  #countSameEvent = null;
  #countTimeEvent = null;

  constructor(tasks) {
    super();

    this._data = {
      tasks
    };

    this.#countMoneyData = countMoneyForEachEvent(tasks);
    this.#countSameEvent = countSameEvent(tasks);
    this.#countTimeEvent = countTimeEvent(tasks);


    this.#setCharts();
    // this.#setDatepicker();
  }

  get template() {
    return createStatsTemplate(this._data);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      // this.#datepicker.destroy();
      // this.#datepicker = null;
    }
  }


  restoreHandlers = () => {
    this.#setCharts();
    // this.#setDatepicker();
  }

  #dateChangeHandler = ([dateFrom, dateTo]) => {
    if (!dateFrom || !dateTo) {
      return;
    }

    this.updateData({
      dateFrom,
      dateTo,
    });
  }

  #setCharts = () => {
    const moneyCtx = this.element.querySelector('#money');
    const typeCtx = this.element.querySelector('#type');
    const timeCtx =  this.element.querySelector('#time');


    // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * this.#countMoneyData['labels'].length;
    typeCtx.height = BAR_HEIGHT *  this.#countSameEvent['labels'].length;
    timeCtx.height = BAR_HEIGHT *  this.#countTimeEvent['labels'].length;

    this.#moneyChart = new Chart(moneyCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: this.#countMoneyData['labels'],
        datasets: [{
          data: this.#countMoneyData['data'],
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
          barThickness: 44,
          minBarLength: 50,
        }],
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: '#690000',
            anchor: 'end',
            align: 'start',
            formatter: (val) => `€ ${val}`,
          },
        },
        title: {
          display: true,
          text: 'MONEY',
          fontColor: '#000000',
          fontSize: 23,
          position: 'left',
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });

    this.#typeChart = new Chart(typeCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels:  this.#countSameEvent['labels'],
        datasets: [{
          data:  this.#countSameEvent['data'],
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
          barThickness: 44,
          minBarLength: 50,
        }],
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: '#000000',
            anchor: 'end',
            align: 'start',
            formatter: (val) => `${val}x`,
          },
        },
        title: {
          display: true,
          text: 'TYPE',
          fontColor: '#000000',
          fontSize: 23,
          position: 'left',
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });

    this.#timeChart = new Chart(timeCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels:  this.#countTimeEvent['labels'],
        datasets: [{
          data:  this.#countTimeEvent['data'],
          backgroundColor: '#ffffaa',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
          barThickness: 44,
          minBarLength: 50,
        }],
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: '#000000',
            anchor: 'end',
            align: 'start',
            formatter: (val) => `${dayjs(val).format('HH:mm')}`,
          },
        },
        title: {
          display: true,
          text: 'TIME',
          fontColor: '#000000',
          fontSize: 23,
          position: 'left',
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  }
}
