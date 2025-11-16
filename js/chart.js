/**
 * 图表生成模块 - 用于绘制投资增长趋势图表
 */

class InvestmentChart {
    /**
     * 构造函数
     */
    constructor() {
        this.chartColors = {
            primary: '#4F46E5',
            success: '#10B981',
            secondary: '#6366F1',
            warning: '#F59E0B',
            interest: '#EC4899',
            principal: '#6B7280',
            grid: '#E5E7EB'
        };
    }
    
    /**
     * 初始化一次性投资图表
     * @param {string} canvasId - Canvas元素ID
     */
    initLumpSumChart(canvasId) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // 创建图表
        this.lumpSumChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: '本金',
                        data: [],
                        borderColor: this.chartColors.principal,
                        backgroundColor: 'rgba(107, 114, 128, 0.1)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.3,
                        pointRadius: 3,
                        pointHoverRadius: 5
                    },
                    {
                        label: '本金+利息',
                        data: [],
                        borderColor: this.chartColors.primary,
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: this.chartColors.primary,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                ...this._getChartOptions('一次性投资增长趋势'),
                plugins: {
                    ...this._getChartOptions('').plugins,
                    tooltip: {
                        ...this._getChartOptions('').plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += '¥' + context.parsed.y.toLocaleString('zh-CN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    });
                                }
                                return label;
                            },
                            afterBody: function(context) {
                                if (context[0].datasetIndex === 1 && context[0].raw > 0) {
                                    const principal = context[0].parsed.y;
                                    const initialValue = context[1].parsed.y;
                                    const interest = principal - initialValue;
                                    const interestRate = initialValue > 0 ? ((interest / initialValue) * 100).toFixed(2) : '0.00';
                                    
                                    return [
                                        '',
                                        '累计收益: ¥' + interest.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                                        '收益率: ' + interestRate + '%'
                                    ];
                                }
                                return [];
                            }
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart',
                    delay: function(context) {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default') {
                            delay = context.dataIndex * 30 + context.datasetIndex * 100;
                        }
                        return delay;
                    }
                }
            }
        });
    }
    
    /**
     * 初始化定期投资图表
     * @param {string} canvasId - Canvas元素ID
     */
    initRegularInvestmentChart(canvasId) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // 创建图表
        this.regularChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        label: '本金',
                        data: [],
                        backgroundColor: this.chartColors.principal,
                        borderColor: this.chartColors.principal,
                        borderWidth: 1,
                        borderRadius: 4,
                        borderSkipped: false
                    },
                    {
                        label: '利息',
                        data: [],
                        backgroundColor: this.chartColors.interest,
                        borderColor: this.chartColors.interest,
                        borderWidth: 1,
                        borderRadius: 4,
                        borderSkipped: false
                    }
                ]
            },
            options: {
                ...this._getChartOptions('定期定额投资增长趋势'),
                scales: {
                    ...this._getChartOptions('').scales,
                    x: {
                        stacked: true,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        grid: {
                            color: this.chartColors.grid,
                            lineWidth: 1,
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            callback: function(value) {
                                if (value >= 10000) {
                                    return (value / 10000).toFixed(1) + '万';
                                }
                                return value;
                            },
                            padding: 10
                        }
                    }
                },
                plugins: {
                    ...this._getChartOptions('').plugins,
                    tooltip: {
                        ...this._getChartOptions('').plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += '¥' + context.parsed.y.toLocaleString('zh-CN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    });
                                }
                                return label;
                            },
                            afterBody: function(context) {
                                const principal = context[0].raw;
                                const interest = context[1].raw;
                                const total = principal + interest;
                                const returnRate = principal > 0 ? ((interest / principal) * 100).toFixed(2) : '0.00';
                                
                                return [
                                    '',
                                    '账户总价值: ¥' + total.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2}),
                                    '收益率: ' + returnRate + '%'
                                ];
                            }
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart',
                    delay: function(context) {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default') {
                            delay = context.dataIndex * 50 + context.datasetIndex * 100;
                        }
                        return delay;
                    }
                }
            }
        });
    }
    
    /**
     * 更新一次性投资图表数据
     * @param {Array} annualData - 年度数据数组
     */
    updateLumpSumChart(annualData) {
        if (!this.lumpSumChart) return;
        
        const labels = annualData.map(item => `${item.year}年`);
        const principalData = annualData.map(item => item.principal);
        const totalValueData = annualData.map(item => item.value);
        
        this.lumpSumChart.data.labels = labels;
        this.lumpSumChart.data.datasets[0].data = principalData;
        this.lumpSumChart.data.datasets[1].data = totalValueData;
        
        this.lumpSumChart.update('active');
    }
    
    /**
     * 更新定期投资图表数据
     * @param {Array} annualData - 年度数据数组
     */
    updateRegularInvestmentChart(annualData) {
        if (!this.regularChart) return;
        
        const labels = annualData.map(item => `${item.year}年`);
        const principalData = annualData.map(item => item.principal);
        const interestData = annualData.map(item => item.interest);
        
        this.regularChart.data.labels = labels;
        this.regularChart.data.datasets[0].data = principalData;
        this.regularChart.data.datasets[1].data = interestData;
        
        this.regularChart.update('active');
    }
    
    /**
     * 获取通用图表配置
     * @param {string} title - 图表标题
     * @returns {Object} 图表配置对象
     */
    _getChartOptions(title) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
                axis: 'x'
            },
            animation: {
                duration: 1500,
                easing: 'easeOutQuart'
            },
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#1f2937',
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        font: {
                            size: 12
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.datasets.map((dataset, i) => {
                                    return {
                                        text: dataset.label,
                                        fillStyle: dataset.backgroundColor,
                                        strokeStyle: dataset.borderColor,
                                        lineWidth: dataset.borderWidth,
                                        pointStyle: 'circle',
                                        hidden: !chart.isDatasetVisible(i),
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    borderColor: this.chartColors.grid,
                    borderWidth: 1,
                    displayColors: true
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        padding: 10
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: this.chartColors.grid,
                        lineWidth: 1,
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            if (value >= 10000) {
                                return (value / 10000).toFixed(1) + '万';
                            }
                            return value;
                        },
                        padding: 10
                    }
                }
            }
        };
    }
    
    /**
     * 创建投资方式比较图表
     * @param {string} canvasId - Canvas元素ID
     * @param {Array} lumpSumData - 一次性投资数据
     * @param {Array} regularData - 定期定额投资数据
     */
    createComparisonChart(canvasId, lumpSumData, regularData) {
        // 检查是否有比较图表容器
        const ctx = document.getElementById(canvasId)?.getContext('2d');
        if (!ctx || !lumpSumData || !regularData) return;
        
        // 确保有相同的年份数量
        const minYears = Math.min(lumpSumData.length, regularData.length);
        const labels = lumpSumData.slice(0, minYears).map(item => `${item.year}年`);
        const lumpSumValues = lumpSumData.slice(0, minYears).map(item => item.value);
        const regularValues = regularData.slice(0, minYears).map(item => item.value);
        
        // 如果已有图表实例，销毁它
        if (this.comparisonChart) {
            this.comparisonChart.destroy();
        }
        
        // 创建比较图表
        this.comparisonChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '一次性投资',
                        data: lumpSumValues,
                        borderColor: this.chartColors.primary,
                        backgroundColor: `${this.chartColors.primary}20`,
                        borderWidth: 3,
                        pointBackgroundColor: this.chartColors.primary,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: '定期定额投资',
                        data: regularValues,
                        borderColor: this.chartColors.success,
                        backgroundColor: `${this.chartColors.success}20`,
                        borderWidth: 3,
                        pointBackgroundColor: this.chartColors.success,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                ...this._getChartOptions('投资方式对比分析'),
                plugins: {
                    ...this._getChartOptions('').plugins,
                    tooltip: {
                        ...this._getChartOptions('').plugins.tooltip,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += '¥' + context.parsed.y.toLocaleString('zh-CN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    });
                                }
                                return label;
                            },
                            afterBody: function(context) {
                                if (context.length >= 2) {
                                    const lumpSumValue = context[0].datasetIndex === 0 ? context[0].raw : context[1].raw;
                                    const regularValue = context[0].datasetIndex === 1 ? context[0].raw : context[1].raw;
                                    
                                    let comparisonText = '';
                                    if (lumpSumValue > regularValue) {
                                        comparisonText = `一次性投资高出: ¥${(lumpSumValue - regularValue).toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                                    } else if (regularValue > lumpSumValue) {
                                        comparisonText = `定期投资高出: ¥${(regularValue - lumpSumValue).toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                                    } else {
                                        comparisonText = '两种投资方式收益相同';
                                    }
                                    
                                    return ['', comparisonText];
                                }
                                return [];
                            }
                        }
                    }
                },
                animation: {
                    duration: 1800,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
    
    /**
     * 添加图表动画效果
     */
    addChartAnimation() {
        // 监听滚动，实现图表的渐入效果
        const observerOptions = {
            root: null,
            rootMargin: '-50px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 为图表容器添加动画类
                    entry.target.classList.add('opacity-100');
                    entry.target.classList.remove('opacity-0', 'translate-y-8');
                    
                    // 添加图表数据动画（通过重新渲染实现）
                    setTimeout(() => {
                        this._triggerChartAnimation(entry.target);
                    }, 300);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // 为所有图表容器添加监听
        document.querySelectorAll('.chart-container').forEach(container => {
            container.classList.add('transition-all', 'duration-1000', 'ease-out', 'opacity-0', 'translate-y-8');
            observer.observe(container);
        });
    }
    
    /**
     * 触发图表数据动画
     * @param {HTMLElement} container - 图表容器
     */
    _triggerChartAnimation(container) {
        const canvas = container.querySelector('canvas');
        if (!canvas) return;
        
        // 找到对应的图表实例
        let chartInstance = null;
        if (canvas.id === 'lump-sum-chart') chartInstance = this.lumpSumChart;
        else if (canvas.id === 'regular-investment-chart') chartInstance = this.regularChart;
        else if (canvas.id === 'comparison-chart') chartInstance = this.comparisonChart;
        
        // 触发动画更新
        if (chartInstance) {
            chartInstance.update('active');
        }
    }
    
    /**
     * 导出图表为图片
     * @param {string} chartId - 图表Canvas元素ID
     * @returns {string} - 图片的base64字符串
     */
    exportChartAsImage(chartId) {
        const canvas = document.getElementById(chartId);
        if (!canvas) return null;
        
        try {
            return canvas.toDataURL('image/png');
        } catch (error) {
            console.error('导出图表失败:', error);
            return null;
        }
    }
}

// 导出图表实例
const investmentChart = new InvestmentChart();

// 在Node.js环境中使用模块导出
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { investmentChart };
}

// 在浏览器环境中将实例添加到window对象
if (typeof window !== 'undefined') {
    window.investmentChart = investmentChart;
    console.log('图表实例已添加到window对象');
}