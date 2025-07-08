// 密码验证逻辑 (独立JS文件)
document.addEventListener("DOMContentLoaded", function() {
    // 配置项
    const config = {
        correctPassword: btoa("yxy241007"), // Base64编码后的密码（真实密码是 yxy241007）
        maxAttempts: 3,
        redirectUrl: "articles.html",
        swalOptions: {
            title: "🔒 文章栏目已加密",
            input: "password",
            inputPlaceholder: "请输入访问密码",
            showCancelButton: true,
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            inputValidator: (value) => !value && "密码不能为空！"
        }
    };

    // 初始化尝试次数
    let attempts = 0;

    // 绑定文章按钮点击事件
    const articleLink = document.querySelector('a[href*="articles.html"]');
    if (articleLink) {
        articleLink.addEventListener("click", function(e) {
            e.preventDefault(); // 阻止默认跳转
            checkPassword();
        });
    }

    // 密码验证函数
    async function checkPassword() {
        if (attempts >= config.maxAttempts) {
            await Swal.fire("锁定", "尝试次数过多，请稍后再试！", "error");
            return;
        }

        const { value: inputPassword } = await Swal.fire(config.swalOptions);

        // 用户点击取消
        if (inputPassword === undefined) return;

        // 验证密码（对比Base64编码值）
        if (btoa(inputPassword) === config.correctPassword) {
            await Swal.fire("成功", "密码正确，即将跳转...", "success");
            window.location.href = config.redirectUrl;
        } else {
            attempts++;
            const remaining = config.maxAttempts - attempts;
            await Swal.fire({
                icon: "error",
                title: "密码错误",
                text: remaining > 0 ? `剩余尝试次数: ${remaining}` : "已锁定",
            });
        }
    }
});