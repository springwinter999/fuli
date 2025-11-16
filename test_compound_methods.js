// 复利计算方式测试脚本
// 此脚本用于验证不同复利方式下的计算结果是否符合预期

// 定义测试参数
const testParams = {
    lumpSum: {
        principal: 100000,  // 本金10万元
        rate: 0.08,         // 年化利率8%
        years: 10           // 投资期限10年
    },
    regularInvestment: {
        monthlyPayment: 1000,  // 每月投资1000元
        rate: 0.08,            // 年化利率8%
        years: 10              // 投资期限10年
    }
};

// 复利方式列表
const compoundMethods = [
    { name: '年复利', value: 1 },
    { name: '月复利', value: 12 },
    { name: '周复利', value: 52 },
    { name: '日复利', value: 365 }
];

// 等待页面加载完成后执行测试
window.addEventListener('load', function() {
    console.log('开始测试不同复利方式的计算结果...');
    
    // 测试一次性投资
    console.log('\n=== 一次性投资测试 ===');
    console.log(`本金: ${testParams.lumpSum.principal.toLocaleString()} 元, 年化利率: ${(testParams.lumpSum.rate * 100).toFixed(2)}%, 投资年限: ${testParams.lumpSum.years} 年`);
    
    let previousResult = 0;
    for (const method of compoundMethods) {
        // 应用复利公式进行计算
        const r = testParams.lumpSum.rate / method.value;
        const n = testParams.lumpSum.years * method.value;
        const result = testParams.lumpSum.principal * Math.pow(1 + r, n);
        const interest = result - testParams.lumpSum.principal;
        
        console.log(`${method.name} (${method.value}次/年):`);
        console.log(`  最终金额: ${result.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} 元`);
        console.log(`  利息收益: ${interest.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} 元`);
        
        // 验证复利频率越高结果越大
        if (previousResult > 0 && result <= previousResult) {
            console.log(`  ⚠️  警告: ${method.name}的结果应大于${compoundMethods[compoundMethods.indexOf(method)-1].name}`);
        }
        
        previousResult = result;
    }
    
    // 测试定期定额投资
    console.log('\n=== 定期定额投资测试 ===');
    console.log(`每月投资: ${testParams.regularInvestment.monthlyPayment} 元, 年化利率: ${(testParams.regularInvestment.rate * 100).toFixed(2)}%, 投资年限: ${testParams.regularInvestment.years} 年`);
    
    previousResult = 0;
    for (const method of compoundMethods) {
        // 计算每期投资金额和利率
        const regularPaymentPerPeriod = testParams.regularInvestment.monthlyPayment * 12 / method.value;
        const r = testParams.regularInvestment.rate / method.value;
        const n = testParams.regularInvestment.years * method.value;
        
        // 应用定期定额投资公式
        const result = regularPaymentPerPeriod * ((Math.pow(1 + r, n) - 1) / r);
        const totalInvestment = testParams.regularInvestment.monthlyPayment * 12 * testParams.regularInvestment.years;
        const interest = result - totalInvestment;
        
        console.log(`${method.name} (${method.value}次/年):`);
        console.log(`  最终金额: ${result.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} 元`);
        console.log(`  总投资: ${totalInvestment.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} 元`);
        console.log(`  利息收益: ${interest.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} 元`);
        
        // 验证复利频率越高结果越大
        if (previousResult > 0 && result <= previousResult) {
            console.log(`  ⚠️  警告: ${method.name}的结果应大于${compoundMethods[compoundMethods.indexOf(method)-1].name}`);
        }
        
        previousResult = result;
    }
    
    console.log('\n测试完成! 请检查计算结果是否符合预期。');
    console.log('理论上，复利频率越高，最终收益应该越高。');
});

// 在控制台提供测试函数，允许手动触发测试
window.testCompoundMethods = function() {
    console.log('手动触发复利方式测试...');
    // 重新执行上面的测试逻辑
    // 这里可以复用上面的测试代码
};
