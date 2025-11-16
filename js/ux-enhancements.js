/**
 * 用户体验增强模块
 * 提供高级动画效果和交互优化
 */

class UXEnhancer {
    constructor() {
        this.init();
    }
    
    /**
     * 初始化所有UX增强功能
     */
    init() {
        // 初始化导航栏滚动效果
        this.initNavbarScrollEffect();
        
        // 初始化输入验证增强
        this.initInputValidations();
        
        // 初始化微交互效果
        this.initMicroInteractions();
        
        // 初始化数值变化动画
        this.initNumberAnimations();
        
        // 初始化加载状态指示
        this.initLoadingIndicators();
        
        // 初始化响应式增强
        this.initResponsiveEnhancements();
    }
    
    /**
     * 导航栏滚动效果
     */
    initNavbarScrollEffect() {
        const header = document.querySelector('header');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // 添加滚动时的背景效果
            if (currentScrollY > 50) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
            
            // 隐藏/显示导航栏效果
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // 向下滚动且超过100px，隐藏导航
                header.style.transform = 'translateY(-100%)';
            } else {
                // 向上滚动，显示导航
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    /**
     * 输入验证增强
     */
    initInputValidations() {
        const numberInputs = document.querySelectorAll('input[type="number"]');
        
        numberInputs.forEach(input => {
            // 添加输入限制
            input.addEventListener('keypress', (e) => {
                // 只允许数字、小数点和负号（如果允许负数）
                const char = String.fromCharCode(e.keyCode);
                const hasDecimal = input.value.includes('.');
                
                if (!/\d/.test(char) && char !== '.') {
                    e.preventDefault();
                }
                
                if (char === '.' && hasDecimal) {
                    e.preventDefault();
                }
            });
            
            // 添加输入反馈
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
                
                // 验证输入值
                if (parseFloat(input.value) < 0) {
                    input.classList.add('border-red-500');
                    this.showInputError(input, '请输入非负值');
                } else {
                    input.classList.remove('border-red-500');
                    this.hideInputError(input);
                }
            });
        });
    }
    
    /**
     * 显示输入错误提示
     */
    showInputError(input, message) {
        // 移除已存在的错误提示
        this.hideInputError(input);
        
        // 创建错误提示元素
        const errorElement = document.createElement('div');
        errorElement.className = 'text-red-500 text-xs mt-1 animate-fadeIn';
        errorElement.textContent = message;
        errorElement.id = `error-${input.id}`;
        
        // 插入到输入框下方
        input.parentNode.appendChild(errorElement);
        
        // 添加输入框错误样式
        input.classList.add('focus:ring-red-500/50', 'focus:border-red-500');
    }
    
    /**
     * 隐藏输入错误提示
     */
    hideInputError(input) {
        const errorElement = document.getElementById(`error-${input.id}`);
        if (errorElement) {
            errorElement.remove();
        }
        
        // 移除输入框错误样式
        input.classList.remove('focus:ring-red-500/50', 'focus:border-red-500');
    }
    
    /**
     * 微交互效果
     */
    initMicroInteractions() {
        // 为卡片添加悬停效果
        const cards = document.querySelectorAll('.bg-white.rounded-xl');
        cards.forEach(card => {
            card.classList.add('card-hover');
        });
        
        // 为按钮添加更丰富的交互效果
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mousedown', () => {
                button.classList.add('scale-98');
            });
            
            button.addEventListener('mouseup', () => {
                button.classList.remove('scale-98');
            });
            
            button.addEventListener('mouseleave', () => {
                button.classList.remove('scale-98');
            });
        });
        
        // 为结果卡片添加动画类
        const resultCards = document.querySelectorAll('.bg-white.p-4.rounded-lg');
        resultCards.forEach(card => {
            card.classList.add('result-card');
        });
    }
    
    /**
     * 数值变化动画
     */
    initNumberAnimations() {
        // 重写animateResults函数，提供更流畅的动画
        window.animateResults = function(...elementIds) {
            elementIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    // 触发CSS动画
                    element.classList.add('animate-number');
                    
                    // 动画结束后移除类
                    setTimeout(() => {
                        element.classList.remove('animate-number');
                    }, 500);
                }
            });
        };
        
        // 添加数字滚动动画
        this.addNumberScrollAnimation();
    }
    
    /**
     * 数字滚动动画效果
     */
    addNumberScrollAnimation() {
        // 为计算结果元素添加滚动动画
        const resultElements = [
            'lump-final-amount', 'lump-total-return-rate', 'lump-interest-earned',
            'regular-final-amount', 'regular-total-principal', 'regular-total-interest', 'regular-total-return-rate'
        ];
        
        resultElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('grow-animation');
            }
        });
    }
    
    /**
     * 加载状态指示
     */
    initLoadingIndicators() {
        // 为计算按钮添加加载状态
        const calculateButtons = [
            document.getElementById('calculate-lump-sum'),
            document.getElementById('calculate-regular')
        ];
        
        calculateButtons.forEach(button => {
            if (button) {
                const originalText = button.innerHTML;
                
                // 在计算开始时显示加载状态
                button.addEventListener('click', function() {
                    this.disabled = true;
                    this.innerHTML = '<div class="loading-spinner mr-2 inline-block"></div> 计算中...';
                    
                    // 模拟计算延迟，实际应用中应该在计算完成后恢复
                    setTimeout(() => {
                        this.disabled = false;
                        this.innerHTML = originalText;
                    }, 300);
                });
            }
        });
    }
    
    /**
     * 响应式增强
     */
    initResponsiveEnhancements() {
        // 检测视口变化，调整UI
        this.updateResponsiveUI();
        window.addEventListener('resize', () => {
            this.updateResponsiveUI();
        });
        
        // 触摸设备优化
        if (this.isTouchDevice()) {
            document.body.classList.add('touch-device');
            
            // 为触摸设备添加更适合的交互
            const interactiveElements = document.querySelectorAll('a, button, input, select');
            interactiveElements.forEach(element => {
                element.addEventListener('touchstart', () => {
                    element.classList.add('active-touch');
                });
                
                element.addEventListener('touchend', () => {
                    setTimeout(() => {
                        element.classList.remove('active-touch');
                    }, 150);
                });
            });
        }
    }
    
    /**
     * 更新响应式UI
     */
    updateResponsiveUI() {
        const isMobile = window.innerWidth < 768;
        
        // 根据屏幕尺寸调整图表高度
        const charts = document.querySelectorAll('canvas');
        charts.forEach(chart => {
            chart.style.height = isMobile ? '250px' : '300px';
        });
        
        // 在移动设备上调整输入框大小
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            if (isMobile) {
                input.classList.add('text-lg');
            } else {
                input.classList.remove('text-lg');
            }
        });
    }
    
    /**
     * 检测是否为触摸设备
     */
    isTouchDevice() {
        return ('ontouchstart' in window) || 
               (navigator.maxTouchPoints > 0) || 
               (navigator.msMaxTouchPoints > 0);
    }
    
    /**
     * 添加平滑滚动到指定元素
     */
    scrollToElement(elementId, offset = -80) {
        const element = document.getElementById(elementId);
        if (element) {
            const targetPosition = element.getBoundingClientRect().top + window.pageYOffset + offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // 添加滚动目标高亮
            element.classList.add('bg-blue-50');
            setTimeout(() => {
                element.classList.remove('bg-blue-50');
            }, 2000);
        }
    }
}

// 在DOM加载完成后初始化UX增强功能
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保其他脚本已加载
    setTimeout(() => {
        window.uxEnhancer = new UXEnhancer();
    }, 500);
});