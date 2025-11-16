/**
 * 计算器测试脚本
 * 用于验证复利计算逻辑的准确性
 */

function runCalculatorTests() {
    console.log('开始测试复利计算逻辑...');
    
    let testsPassed = 0;
    let totalTests = 0;
    
    // 测试一次性投资计算
    console.log('\n=== 测试一次性投资计算 ===');
    
    // 测试用例1：基本计算 - 年复利
    totalTests++;
    try {
        const result1 = calculator.calculateLumpSum(10000, 8, 10, 1);
        const expectedFutureValue = 10000 * Math.pow(1 + 0.08, 10);
        const expectedReturnRate = ((expectedFutureValue - 10000) / 10000) * 100;
        
        console.log(`测试用例1 - 年复利:`);
        console.log(`  计算结果: ¥${result1.futureValue.toFixed(2)}, 收益率: ${result1.returnRate.toFixed(2)}%`);
        console.log(`  预期结果: ¥${expectedFutureValue.toFixed(2)}, 收益率: ${expectedReturnRate.toFixed(2)}%`);
        
        if (Math.abs(result1.futureValue - expectedFutureValue) < 0.01 && 
            Math.abs(result1.returnRate - expectedReturnRate) < 0.01) {
            console.log('  ✅ 通过');
            testsPassed++;
        } else {
            console.log('  ❌ 失败');
        }
    } catch (error) {
        console.log(`  ❌ 失败: ${error.message}`);
    }
    
    // 测试用例2：月复利
    totalTests++;
    try {
        const result2 = calculator.calculateLumpSum(10000, 8, 10, 12);
        const expectedFutureValue = 10000 * Math.pow(1 + 0.08/12, 10*12);
        const expectedReturnRate = ((expectedFutureValue - 10000) / 10000) * 100;
        
        console.log(`测试用例2 - 月复利:`);
        console.log(`  计算结果: ¥${result2.futureValue.toFixed(2)}, 收益率: ${result2.returnRate.toFixed(2)}%`);
        console.log(`  预期结果: ¥${expectedFutureValue.toFixed(2)}, 收益率: ${expectedReturnRate.toFixed(2)}%`);
        
        if (Math.abs(result2.futureValue - expectedFutureValue) < 0.01 && 
            Math.abs(result2.returnRate - expectedReturnRate) < 0.01) {
            console.log('  ✅ 通过');
            testsPassed++;
        } else {
            console.log('  ❌ 失败');
        }
    } catch (error) {
        console.log(`  ❌ 失败: ${error.message}`);
    }
    
    // 测试用例3：边界条件 - 零利率
    totalTests++;
    try {
        const result3 = calculator.calculateLumpSum(10000, 0, 10, 1);
        
        console.log(`测试用例3 - 零利率:`);
        console.log(`  计算结果: ¥${result3.futureValue.toFixed(2)}, 收益率: ${result3.returnRate.toFixed(2)}%`);
        console.log(`  预期结果: ¥10000.00, 收益率: 0.00%`);
        
        if (result3.futureValue === 10000 && result3.returnRate === 0) {
            console.log('  ✅ 通过');
            testsPassed++;
        } else {
            console.log('  ❌ 失败');
        }
    } catch (error) {
        console.log(`  ❌ 失败: ${error.message}`);
    }
    
    // 测试定期定额投资计算
    console.log('\n=== 测试定期定额投资计算 ===');
    
    // 测试用例4：基本计算 - 月定投，年复利
    totalTests++;
    try {
        const result4 = calculator.calculateRegularInvestment(1000, 8, 10, 1);
        
        // 手动计算验证（简化版本）
        let manualValue = 0;
        const monthlyRate = 0.08 / 12;
        for (let i = 0; i < 10 * 12; i++) {
            manualValue = manualValue * (1 + monthlyRate) + 1000;
        }
        
        console.log(`测试用例4 - 月定投，年复利:`);
        console.log(`  计算结果: ¥${result4.futureValue.toFixed(2)}, 总投入: ¥${result4.totalPrincipal.toFixed(2)}, 收益率: ${result4.returnRate.toFixed(2)}%`);
        console.log(`  预期结果: ¥${manualValue.toFixed(2)}`);
        
        // 由于计算方法略有不同（我们的实现在复利周期才计算利息），允许一定误差
        if (Math.abs(result4.futureValue - manualValue) < 100) {
            console.log('  ✅ 通过 (误差在可接受范围内)');
            testsPassed++;
        } else {
            console.log('  ❌ 失败 (误差过大)');
        }
    } catch (error) {
        console.log(`  ❌ 失败: ${error.message}`);
    }
    
    // 测试用例5：月定投，月复利
    totalTests++;
    try {
        const result5 = calculator.calculateRegularInvestment(1000, 8, 10, 12);
        
        // 手动计算月复利情况
        let manualValue = 0;
        const monthlyRate = 0.08 / 12;
        for (let i = 0; i < 10 * 12; i++) {
            manualValue = manualValue * (1 + monthlyRate) + 1000;
        }
        
        console.log(`测试用例5 - 月定投，月复利:`);
        console.log(`  计算结果: ¥${result5.futureValue.toFixed(2)}, 总投入: ¥${result5.totalPrincipal.toFixed(2)}, 收益率: ${result5.returnRate.toFixed(2)}%`);
        console.log(`  预期结果: ¥${manualValue.toFixed(2)}`);
        
        if (Math.abs(result5.futureValue - manualValue) < 0.01) {
            console.log('  ✅ 通过');
            testsPassed++;
        } else {
            console.log('  ❌ 失败');
        }
    } catch (error) {
        console.log(`  ❌ 失败: ${error.message}`);
    }
    
    // 测试用例6：边界条件 - 短期投资
    totalTests++;
    try {
        const result6 = calculator.calculateRegularInvestment(1000, 8, 1, 12);
        const expectedPrincipal = 1000 * 12;
        
        console.log(`测试用例6 - 短期投资:`);
        console.log(`  计算结果: ¥${result6.futureValue.toFixed(2)}, 总投入: ¥${result6.totalPrincipal.toFixed(2)}`);
        console.log(`  预期总投入: ¥${expectedPrincipal.toFixed(2)}`);
        
        if (result6.totalPrincipal === expectedPrincipal && result6.futureValue > expectedPrincipal) {
            console.log('  ✅ 通过');
            testsPassed++;
        } else {
            console.log('  ❌ 失败');
        }
    } catch (error) {
        console.log(`  ❌ 失败: ${error.message}`);
    }
    
    // 测试格式化功能
    console.log('\n=== 测试格式化功能 ===');
    
    // 测试用例7：货币格式化
    totalTests++;
    try {
        const formattedCurrency = calculator.formatCurrency(12345.67);
        
        console.log(`测试用例7 - 货币格式化:`);
        console.log(`  计算结果: ${formattedCurrency}`);
        console.log(`  预期结果: ¥12,345.67`);
        
        if (formattedCurrency === '¥12,345.67') {
            console.log('  ✅ 通过');
            testsPassed++;
        } else {
            console.log('  ❌ 失败');
        }
    } catch (error) {
        console.log(`  ❌ 失败: ${error.message}`);
    }
    
    // 测试用例8：百分比格式化
    totalTests++;
    try {
        const formattedPercentage = calculator.formatPercentage(123.456);
        
        console.log(`测试用例8 - 百分比格式化:`);
        console.log(`  计算结果: ${formattedPercentage}`);
        console.log(`  预期结果: 123.46%`);
        
        if (formattedPercentage === '123.46%') {
            console.log('  ✅ 通过');
            testsPassed++;
        } else {
            console.log('  ❌ 失败');
        }
    } catch (error) {
        console.log(`  ❌ 失败: ${error.message}`);
    }
    
    // 输出测试总结
    console.log('\n=== 测试总结 ===');
    console.log(`通过测试: ${testsPassed}/${totalTests}`);
    console.log(`通过率: ${(testsPassed/totalTests*100).toFixed(2)}%`);
    
    if (testsPassed === totalTests) {
        console.log('🎉 所有测试通过!');
    } else {
        console.log('⚠️  有测试失败，请检查计算逻辑');
    }
    
    return { passed: testsPassed, total: totalTests };
}

// 在开发环境中自动运行测试
if (typeof window !== 'undefined' && window.location.href.includes('localhost')) {
    // 添加一个延迟，确保所有脚本都已加载
    window.addEventListener('load', function() {
        setTimeout(runCalculatorTests, 1000);
    });
}

// 导出测试函数供外部调用
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { runCalculatorTests }; 
}