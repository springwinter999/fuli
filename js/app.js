// 复利投资计算器应用 - 主要JavaScript文件

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化应用');
    
    try {
        // 初始化移动菜单
        initMobileMenu();
        
        // 初始化计算器功能
        setupCalculatorEvents();
        
        // 初始化UI增强
        initUIEnhancements();
        
    } catch (error) {
        console.error('初始化错误:', error);
    }
});

/**
 * 初始化移动菜单功能
 */
function initMobileMenu() {
    try {
        // 使用多个可能的ID来查找菜单按钮，兼容不同页面
        const menuButton = 
            document.getElementById('mobile-menu-button') || 
            document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (menuButton && mobileMenu) {
            menuButton.addEventListener('click', function() {
                mobileMenu.classList.toggle('hidden');
                console.log('移动菜单切换状态');
                // 切换图标
                const icon = menuButton.querySelector('i');
                if (icon) {
                    if (icon.classList.contains('fa-bars')) {
                        icon.classList.remove('fa-bars');
                        icon.classList.add('fa-times');
                    } else {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
            console.log('移动端菜单初始化完成');
        }
    } catch (error) {
        console.error('初始化移动菜单错误:', error);
    }
}

/**
 * 设置计算器事件处理
 */
function setupCalculatorEvents() {
    try {
        // 查找所有计算按钮
        const calculateButtons = document.querySelectorAll('button[id*="calculate"]');
        
        // 为计算按钮添加事件监听
        calculateButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // 阻止默认行为，防止页面跳转
                e.preventDefault();
                // 检查按钮ID以确定执行哪种计算
                const buttonId = button.id;
                
                if (buttonId.includes('lump')) {
                    calculateLumpSum();
                } else if (buttonId.includes('regular')) {
                    calculateRegularInvestment();
                } else {
                    // 如果按钮没有特定标识，执行两种计算
                    calculateLumpSum();
                    calculateRegularInvestment();
                }
            });
        });
        
        // 为输入框添加键盘事件
        const inputs = document.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    // 根据输入框的容器来确定执行哪种计算
                    const container = input.closest('div[id*="calculator"]');
                    
                    if (container && container.id.includes('lump')) {
                        calculateLumpSum();
                    } else if (container && container.id.includes('regular')) {
                        calculateRegularInvestment();
                    } else {
                        // 默认执行两种计算
                        calculateLumpSum();
                        calculateRegularInvestment();
                    }
                }
            });
        });
        
    } catch (error) {
        console.error('设置计算器事件错误:', error);
    }
}

/**
 * 计算一次性投资回报
 */
function calculateLumpSum() {
    try {
        console.log('开始一次性投资计算');
        // 尝试查找可能的元素ID
        const principalInput = 
            document.getElementById('lump-sum-principal') || 
            document.getElementById('initial-investment') || 
            document.getElementById('principal') ||
            document.getElementById('initial-amount');
        
        const rateInput = 
            document.getElementById('lump-sum-rate') || 
            document.getElementById('annual-rate') || 
            document.getElementById('rate');
        
        const yearsInput = 
            document.getElementById('lump-sum-years') || 
            document.getElementById('investment-years') || 
            document.getElementById('years');
            
        const compoundFrequencySelect = 
            document.getElementById('compound-frequency-lump') || 
            document.getElementById('compound-frequency');
            
        console.log('找到的输入元素:', {
            principalInput: !!principalInput,
            rateInput: !!rateInput,
            yearsInput: !!yearsInput,
            compoundFrequencySelect: !!compoundFrequencySelect
        });
        
        // 验证输入并确保正确转换为数字
        const principal = parseFloat(principalInput?.value) || 100000;
        const rate = parseFloat(rateInput?.value) || 8;
        const years = parseInt(yearsInput?.value, 10) || 10;
        const compoundMethod = parseInt(compoundFrequencySelect?.value || 12, 10);
        
        console.log('计算一次性投资:', { principal, rate, years, compoundMethod });
        
        // 输入验证
        if (principal <= 0 || rate <= 0 || years <= 0) {
            console.error('无效的投资参数');
            return;
        }
        
        // 将百分比转换为小数
        const rateDecimal = rate / 100;
        
        // 使用外部计算器实例（如果可用）
        let result;
        if (window.calculator && typeof window.calculator.calculateLumpSum === 'function') {
            // 使用外部计算器，确保传递数字类型并正确转换利率
            result = window.calculator.calculateLumpSum(principal, rateDecimal, years, compoundMethod);
            console.log('计算器返回结果:', result);
        } else {
            // 使用内置计算
            const r = rateDecimal / compoundMethod;
            const n = years * compoundMethod;
            const futureValue = principal * Math.pow(1 + r, n);
            const totalInterest = futureValue - principal;
            
            result = { futureValue, totalInterest, principal };
        }
        
        // 显示结果
        console.log('计算结果:', result);
        updateLumpSumResult(result);
        
    } catch (error) {
        console.error('一次性投资计算错误:', error);
    }
}

/**
 * 计算定期定额投资回报
 */
function calculateRegularInvestment() {
    try {
        // 尝试查找可能的元素ID
        const monthlyInput = 
            document.getElementById('regular-monthly') || 
            document.getElementById('monthly-investment') || 
            document.getElementById('monthly');
        
        const rateInput = 
            document.getElementById('regular-rate') || 
            document.getElementById('annual-rate-regular') || 
            document.getElementById('rate-regular');
        
        const yearsInput = 
            document.getElementById('regular-years') || 
            document.getElementById('investment-years-regular') || 
            document.getElementById('years-regular');
            
        const compoundFrequencySelect = 
            document.getElementById('compound-frequency-regular') || 
            document.getElementById('compound-frequency');
        
        // 验证输入并确保正确转换为数字
        const monthlyPayment = parseFloat(monthlyInput?.value) || 10000;
        const rate = parseFloat(rateInput?.value) || 8;
        const years = parseInt(yearsInput?.value, 10) || 10;
        const compoundMethod = parseInt(compoundFrequencySelect?.value || 12, 10);
        
        console.log('计算定期定额投资:', { monthlyPayment, rate, years, compoundMethod });
        
        // 输入验证
        if (monthlyPayment <= 0 || rate <= 0 || years <= 0) {
            console.error('无效的投资参数');
            return;
        }
        
        // 将百分比转换为小数
        const rateDecimal = rate / 100;
        
        // 使用外部计算器实例（如果可用）
        let result;
        if (window.calculator && typeof window.calculator.calculateRegularInvestment === 'function') {
            // 使用外部计算器，确保传递数字类型并正确转换利率
            result = window.calculator.calculateRegularInvestment(monthlyPayment, rateDecimal, years, compoundMethod);
            console.log('计算器返回结果:', result);
        } else {
            // 使用内置计算
            const monthlyInvestment = monthlyPayment;
            const compoundRate = rateDecimal / compoundMethod;
            const totalPeriods = years * compoundMethod;
            
            // 对于定期投资，我们假设计息频率和投资频率一致
            const paymentPerPeriod = monthlyInvestment * (12 / compoundMethod);
            const finalAmount = paymentPerPeriod * ((Math.pow(1 + compoundRate, totalPeriods) - 1) / compoundRate);
            const totalPrincipal = monthlyInvestment * years * 12;
            const totalInterest = finalAmount - totalPrincipal;
            
            result = { futureValue: finalAmount, totalPrincipal, totalInterest };
        }
        
        // 显示结果
        updateRegularInvestmentResult(result);
        
    } catch (error) {
        console.error('定期定额投资计算错误:', error);
    }
}

/**
 * 更新一次性投资结果显示
 */
function updateLumpSumResult(result) {
    if (!result) return;
    
    try {
        console.log('更新一次性投资结果');
        // 尝试更新各种可能的结果元素
        const resultElements = [
            document.getElementById('lump-sum-result'),
            document.getElementById('lump-sum-final-amount'),
            document.getElementById('final-amount'),
            document.getElementById('lump-final-amount') // 添加HTML中实际使用的ID
        ];
        
        const interestElements = [
            document.getElementById('lump-sum-interest'),
            document.getElementById('lump-sum-total-interest'),
            document.getElementById('total-interest'),
            document.getElementById('lump-total-interest'), // 添加可能的利息元素ID
            document.getElementById('lump-interest-earned') // 添加利息收益元素ID
        ];
        
        // 添加收益率元素
        const returnRateElements = [
            document.getElementById('lump-total-return-rate')
        ];
        
        // 检查是否找到任何结果元素
        console.log('找到的结果元素:', {
            foundResultElements: resultElements.some(el => !!el),
            foundInterestElements: interestElements.some(el => !!el),
            foundReturnRateElements: returnRateElements.some(el => !!el)
        });
        
        // 使用外部格式化函数或内置函数
        let formattedFutureValue, formattedInterest, formattedReturnRate;
        if (window.calculator && typeof window.calculator.formatCurrency === 'function') {
            formattedFutureValue = window.calculator.formatCurrency(result.futureValue);
            formattedInterest = window.calculator.formatCurrency(result.totalInterest);
        } else {
            formattedFutureValue = formatCurrency(result.futureValue);
            formattedInterest = formatCurrency(result.totalInterest);
        }
        
        // 计算总收益率
        const returnRate = result.principal > 0 ? (result.totalInterest / result.principal) * 100 : 0;
        formattedReturnRate = returnRate.toFixed(2) + '%';
        
        // 更新找到的元素
        resultElements.forEach(el => {
            if (el) {
                el.textContent = formattedFutureValue;
                // 添加简单动画效果
                el.classList.add('animate-pulse');
                setTimeout(() => el.classList.remove('animate-pulse'), 800);
            }
        });
        
        interestElements.forEach(el => {
            if (el) {
                el.textContent = formattedInterest;
                // 添加简单动画效果
                el.classList.add('animate-pulse');
                setTimeout(() => el.classList.remove('animate-pulse'), 800);
            }
        });
        
        // 更新收益率元素
        returnRateElements.forEach(el => {
            if (el) {
                el.textContent = formattedReturnRate;
                // 添加简单动画效果
                el.classList.add('animate-pulse');
                setTimeout(() => el.classList.remove('animate-pulse'), 800);
            }
        });
        
        console.log('一次性投资计算完成:', result);
    } catch (error) {
        console.error('更新一次性投资结果错误:', error);
    }
}

/**
 * 更新定期定额投资结果显示
 */
function updateRegularInvestmentResult(result) {
    if (!result) return;
    
    try {
        // 尝试更新各种可能的结果元素
        const resultElements = [
            document.getElementById('regular-result'),
            document.getElementById('regular-final-amount'),
            document.getElementById('regular-amount')
        ];
        
        const principalElements = [
            document.getElementById('regular-investment'),
            document.getElementById('regular-total-principal'),
            document.getElementById('regular-principal')
        ];
        
        const interestElements = [
            document.getElementById('regular-interest'),
            document.getElementById('regular-total-interest'),
            document.getElementById('regular-total-return')
        ];
        
        // 添加收益率元素
        const returnRateElements = [
            document.getElementById('regular-total-return-rate')
        ];
        
        // 使用外部格式化函数或内置函数
        let formattedFutureValue, formattedPrincipal, formattedInterest, formattedReturnRate;
        if (window.calculator && typeof window.calculator.formatCurrency === 'function') {
            formattedFutureValue = window.calculator.formatCurrency(result.futureValue);
            formattedPrincipal = window.calculator.formatCurrency(result.totalPrincipal);
            formattedInterest = window.calculator.formatCurrency(result.totalInterest);
        } else {
            formattedFutureValue = formatCurrency(result.futureValue);
            formattedPrincipal = formatCurrency(result.totalPrincipal);
            formattedInterest = formatCurrency(result.totalInterest);
        }
        
        // 计算总收益率
        const returnRate = result.totalPrincipal > 0 ? (result.totalInterest / result.totalPrincipal) * 100 : 0;
        formattedReturnRate = returnRate.toFixed(2) + '%';
        
        // 更新找到的元素
        resultElements.forEach(el => {
            if (el) {
                el.textContent = formattedFutureValue;
                // 添加简单动画效果
                el.classList.add('animate-pulse');
                setTimeout(() => el.classList.remove('animate-pulse'), 800);
            }
        });
        
        principalElements.forEach(el => {
            if (el) {
                el.textContent = formattedPrincipal;
                // 添加简单动画效果
                el.classList.add('animate-pulse');
                setTimeout(() => el.classList.remove('animate-pulse'), 800);
            }
        });
        
        interestElements.forEach(el => {
            if (el) {
                el.textContent = formattedInterest;
                // 添加简单动画效果
                el.classList.add('animate-pulse');
                setTimeout(() => el.classList.remove('animate-pulse'), 800);
            }
        });
        
        // 更新收益率元素
        returnRateElements.forEach(el => {
            if (el) {
                el.textContent = formattedReturnRate;
                // 添加简单动画效果
                el.classList.add('animate-pulse');
                setTimeout(() => el.classList.remove('animate-pulse'), 800);
            }
        });
        
        console.log('定期定额投资计算完成:', result);
    } catch (error) {
        console.error('更新定期定额投资结果错误:', error);
    }
}

/**
 * 格式化货币显示（备用函数）
 */
function formatCurrency(value) {
    return '¥' + value.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

/**
 * 初始化UI增强功能
 */
function initUIEnhancements() {
    try {
        // 添加输入框焦点效果
        const inputs = document.querySelectorAll('input');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                const parent = input.parentElement;
                if (parent) {
                    parent.classList.add('bg-blue-50');
                }
            });
            
            input.addEventListener('blur', () => {
                const parent = input.parentElement;
                if (parent) {
                    parent.classList.remove('bg-blue-50');
                }
            });
        });
        
        // 添加平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // 如果是移动设备，点击后关闭菜单
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            });
        });
        
        console.log('UI增强功能初始化完成');
    } catch (error) {
        console.error('初始化UI增强错误:', error);
    }
}

// 全局错误处理
window.addEventListener('error', function(e) {
    console.error('全局JavaScript错误:', e.error);
});