/**
 * 复利投资计算器 - 核心计算逻辑
 */

// 复利计算方式常量定义
const COMPOUND_METHODS = {
    YEARLY: { value: 1, label: '年复利', description: '一年结算一次利息', days: 365 },
    MONTHLY: { value: 12, label: '月复利', description: '每月结算一次利息', days: 30 },
    WEEKLY: { value: 52, label: '周复利', description: '每周结算一次利息', days: 7 },
    DAILY: { value: 365, label: '日复利', description: '每天结算一次利息', days: 1 }
};

class InvestmentCalculator {
    constructor() {
        // 设置默认复利方式为月复利
        this.defaultCompoundMethod = COMPOUND_METHODS.MONTHLY;
    }
    
    /**
     * 获取复利频率值
     * @param {string|number} method - 复利方式（'yearly', 'monthly', 'weekly', 'daily'）或直接的复利频率值
     * @returns {number} 复利频率值（每年复利次数）
     */
    getCompoundFrequency(method) {
        // 确保方法参数被正确转换为数字或字符串
        if (typeof method === 'string') {
            // 尝试将字符串直接转换为数字
            const numMethod = parseInt(method, 10);
            if (!isNaN(numMethod)) {
                return numMethod;
            }
            
            // 否则按方法名称处理
            const methodKey = method.toUpperCase();
            switch (methodKey) {
                case 'YEARLY':
                    return COMPOUND_METHODS.YEARLY.value;
                case 'MONTHLY':
                    return COMPOUND_METHODS.MONTHLY.value;
                case 'WEEKLY':
                    return COMPOUND_METHODS.WEEKLY.value;
                case 'DAILY':
                    return COMPOUND_METHODS.DAILY.value;
                default:
                    return this.defaultCompoundMethod.value;
            }
        }
        
        if (typeof method === 'number') {
            return method;
        }
        
        return this.defaultCompoundMethod.value;
    }
    
    /**
     * 获取所有可用的复利计算方式
     * @returns {Object} 复利计算方式对象
     */
    getCompoundMethods() {
        return COMPOUND_METHODS;
    }
    /**
     * 计算一次性投资未来价值
     * @param {number} principal - 本金
     * @param {number} rate - 年化利率（小数形式）
     * @param {number} years - 投资年限
     * @param {string|number} compoundMethod - 复利方式
     * @returns {object} 包含未来价值、本金和利息的对象
     */
    calculateLumpSum(principal, rate, years, compoundMethod = this.defaultCompoundMethod.value) {
        // 验证输入
        if (principal < 0 || rate < 0 || years < 0) {
            throw new Error('输入参数不能为负数');
        }
        
        // 获取复利频率
        const compoundFrequency = this.getCompoundFrequency(compoundMethod);
        
        // 计算每期利率
        const periodRate = rate / compoundFrequency;
        
        // 计算总期数
        const totalPeriods = years * compoundFrequency;
        
        // 应用复利公式: FV = PV * (1 + r)^n
        const futureValue = principal * Math.pow(1 + periodRate, totalPeriods);
        const totalInterest = futureValue - principal;
        
        // 返回包含所有必要信息的对象
        return { futureValue, principal, totalInterest };
    }
    
    /**
     * 计算定期定额投资未来价值
     * @param {number} monthlyPayment - 每月投资金额
     * @param {number} rate - 年化利率（小数形式）
     * @param {number} years - 投资年限
     * @param {string|number} compoundMethod - 复利方式
     * @returns {object} 包含未来价值、总投资和利息的对象
     */
    calculateRegularInvestment(monthlyPayment, rate, years, compoundMethod = this.defaultCompoundMethod.value) {
        // 验证输入
        if (monthlyPayment < 0 || rate < 0 || years < 0) {
            throw new Error('输入参数不能为负数');
        }
        
        // 获取复利频率
        const compoundFrequency = this.getCompoundFrequency(compoundMethod);
        
        // 转换为总月数
        const totalMonths = years * 12;
        
        // 初始未来价值为0
        let futureValue = 0;
        
        // 根据复利频率计算每次复利的时间间隔（月）
        const compoundIntervalInMonths = 12 / compoundFrequency;
        
        // 为了避免浮点数精度问题，使用累计复利周期数来跟踪
        let compoundPeriods = 0;
        
        // 模拟每月投资和复利计算
        for (let month = 1; month <= totalMonths; month++) {
            // 添加当月投资
            futureValue += monthlyPayment;
            
            // 使用更精确的方式判断是否需要复利
            // 计算当前应该完成的复利周期数
            const expectedCompoundPeriods = Math.floor((month / 12) * compoundFrequency);
            
            if (expectedCompoundPeriods > compoundPeriods) {
                // 需要复利，计算复利次数
                const periodsToAdd = expectedCompoundPeriods - compoundPeriods;
                
                // 计算该复利周期的利率
                const periodRate = rate / compoundFrequency;
                
                // 应用复利
                for (let i = 0; i < periodsToAdd; i++) {
                    futureValue *= (1 + periodRate);
                }
                
                // 更新已完成的复利周期数
                compoundPeriods = expectedCompoundPeriods;
            }
        }
        
        // 计算总投资金额和利息
        const totalPrincipal = monthlyPayment * totalMonths;
        const totalInterest = futureValue - totalPrincipal;
        
        // 返回包含所有必要信息的对象
        return { futureValue, totalPrincipal, totalInterest };
    }
    
    /**
     * 生成一次性投资的年度数据，用于图表显示
     * @param {number} principal - 初始本金
     * @param {number} annualRate - 年化利率（百分比）
     * @param {number} years - 投资年限
     * @param {number} compoundFrequency - 复利频率（每年复利次数）
     * @returns {Array} 年度数据数组
     */
    generateLumpSumAnnualData(principal, annualRate, years, compoundMethod = this.defaultCompoundMethod.value) {
        // 获取复利频率值
        const compoundFrequency = this.getCompoundFrequency(compoundMethod);
        const rate = annualRate / 100;
        const data = [];
        
        for (let year = 0; year <= years; year++) {
            const value = principal * Math.pow(1 + rate / compoundFrequency, compoundFrequency * year);
            data.push({
                year: year,
                value: value,
                principal: principal,
                interest: value - principal
            });
        }
        
        return data;
    }
    
    /**
     * 生成定期定额投资的年度数据，用于图表显示
     * @param {number} monthlyPayment - 每月定投金额
     * @param {number} annualRate - 年化利率（百分比）
     * @param {number} years - 投资年限
     * @param {number} compoundFrequency - 复利频率（每年复利次数）
     * @returns {Array} 年度数据数组
     */
    generateRegularInvestmentAnnualData(monthlyPayment, annualRate, years, compoundMethod = this.defaultCompoundMethod.value) {
        // 获取复利频率值
        const compoundFrequency = this.getCompoundFrequency(compoundMethod);
        const rate = annualRate / 100;
        const data = [];
        let value = 0;
        const compoundIntervalInMonths = 12 / compoundFrequency;
        
        // 第0年（初始状态）
        data.push({
            year: 0,
            value: 0,
            principal: 0,
            interest: 0
        });
        
        // 每年的数据
        for (let year = 1; year <= years; year++) {
            // 模拟该年的12个月
            for (let month = 1; month <= 12; month++) {
                value += monthlyPayment;
                
                // 检查是否需要复利
                const totalMonths = (year - 1) * 12 + month;
                // 使用更精确的方式判断复利时机
                const expectedCompoundPeriods = Math.floor((totalMonths / 12) * compoundFrequency);
                const currentCompoundPeriods = Math.floor(((totalMonths - 1) / 12) * compoundFrequency);
                
                if (expectedCompoundPeriods > currentCompoundPeriods) {
                    const periodRate = rate / compoundFrequency;
                    value *= (1 + periodRate);
                }
            }
            
            const principal = monthlyPayment * 12 * year;
            data.push({
                year: year,
                value: value,
                principal: principal,
                interest: value - principal
            });
        }
        
        return data;
    }
    
    /**
     * 格式化货币显示
     * @param {number} amount - 金额
     * @returns {string} 格式化后的货币字符串
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
    
    /**
     * 格式化百分比显示
     * @param {number} rate - 百分比数值
     * @returns {string} 格式化后的百分比字符串
     */
    formatPercentage(rate) {
        return rate.toFixed(2) + '%';
    }
}

// 导出计算器实例
const calculator = new InvestmentCalculator();
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { calculator };
}