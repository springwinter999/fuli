/**
 * 复利投资计算器 - 核心计算逻辑
 */

class InvestmentCalculator {
    /**
     * 计算一次性投资的复利结果
     * @param {number} principal - 初始本金
     * @param {number} annualRate - 年化利率（百分比）
     * @param {number} years - 投资年限
     * @param {number} compoundFrequency - 复利频率（每年复利次数）
     * @returns {Object} 计算结果对象
     */
    calculateLumpSum(principal, annualRate, years, compoundFrequency) {
        // 验证输入
        if (principal < 0 || annualRate < 0 || years < 0 || compoundFrequency <= 0) {
            throw new Error('输入参数不能为负数');
        }
        
        // 将百分比转换为小数
        const rate = annualRate / 100;
        
        // 复利计算公式: FV = P × (1 + r/n)^(nt)
        const futureValue = principal * Math.pow(1 + rate / compoundFrequency, compoundFrequency * years);
        
        // 计算总收益
        const totalInterest = futureValue - principal;
        
        // 计算总收益率
        const returnRate = (totalInterest / principal) * 100;
        
        return {
            principal: principal,
            futureValue: futureValue,
            totalInterest: totalInterest,
            returnRate: returnRate
        };
    }
    
    /**
     * 计算定期定额投资的复利结果
     * @param {number} monthlyPayment - 每月定投金额
     * @param {number} annualRate - 年化利率（百分比）
     * @param {number} years - 投资年限
     * @param {number} compoundFrequency - 复利频率（每年复利次数）
     * @returns {Object} 计算结果对象
     */
    calculateRegularInvestment(monthlyPayment, annualRate, years, compoundFrequency) {
        // 验证输入
        if (monthlyPayment < 0 || annualRate < 0 || years < 0 || compoundFrequency <= 0) {
            throw new Error('输入参数不能为负数');
        }
        
        // 将百分比转换为小数
        const rate = annualRate / 100;
        
        // 总投入本金
        const totalPrincipal = monthlyPayment * 12 * years;
        
        // 计算未来价值
        // 对于定期定额投资，由于投资是每月进行，但复利频率可能不同，需要精确计算
        
        let futureValue = 0;
        const totalMonths = years * 12;
        
        // 根据复利频率计算每次复利的时间间隔（月）
        const compoundIntervalInMonths = 12 / compoundFrequency;
        
        // 模拟每月投资和复利计算
        for (let month = 1; month <= totalMonths; month++) {
            // 添加当月投资
            futureValue += monthlyPayment;
            
            // 检查是否需要复利
            if (month % compoundIntervalInMonths === 0) {
                // 计算该复利周期的利率
                const periodRate = rate / compoundFrequency;
                futureValue *= (1 + periodRate);
            }
        }
        
        // 计算总收益
        const totalInterest = futureValue - totalPrincipal;
        
        // 计算总收益率
        const returnRate = totalPrincipal > 0 ? (totalInterest / totalPrincipal) * 100 : 0;
        
        return {
            monthlyPayment: monthlyPayment,
            totalPrincipal: totalPrincipal,
            futureValue: futureValue,
            totalInterest: totalInterest,
            returnRate: returnRate
        };
    }
    
    /**
     * 生成一次性投资的年度数据，用于图表显示
     * @param {number} principal - 初始本金
     * @param {number} annualRate - 年化利率（百分比）
     * @param {number} years - 投资年限
     * @param {number} compoundFrequency - 复利频率（每年复利次数）
     * @returns {Array} 年度数据数组
     */
    generateLumpSumAnnualData(principal, annualRate, years, compoundFrequency) {
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
    generateRegularInvestmentAnnualData(monthlyPayment, annualRate, years, compoundFrequency) {
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
                if (totalMonths % compoundIntervalInMonths === 0) {
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