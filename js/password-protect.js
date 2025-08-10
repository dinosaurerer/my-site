document.addEventListener("DOMContentLoaded", function() {
    const config = {
        salt: "a1b2c3d4",  

        passwords: {
            "articles.html": "5332767104b91a708b88c8bcbde1d2da20dd00f6d4cceabd3223efe7bd3c0e39",
            "jie.html": "776a78eabde498cad4cb9358b79c5e965c5c20de3af10500b2f15455b992ff81",
            "peizi.html": "ac06c5c1ebe91604a718117f0d15412166310a075c2eb767f9e0cd5067bdb07c",
        },
        maxAttempts: 3,
        tokenPrefix: "access_token_",
        swalOptions: {
            title: "🔒 内容已加密",
            input: "password",
            inputPlaceholder: "请输入访问密码",
            showCancelButton: true,
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            allowOutsideClick: false,
            inputValidator: (value) => !value && "密码不能为空！"
        }
    };

    let attempts = 0;
    let currentPage = "";

    // 绑定加密链接
    const protectedLinks = document.querySelectorAll('a[href*="articles.html"], a[href*="peizi.html"], a[href*="jie.html"]');
    protectedLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            currentPage = link.getAttribute('href').split('/').pop();
            checkPassword();
        });
    });

    // 利用Web Crypto API做SHA-256哈希
    async function hashPassword(password, salt) {
        const encoder = new TextEncoder();
        const data = encoder.encode(salt + password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    async function checkPassword() {
        if (attempts >= config.maxAttempts) {
            await Swal.fire({
                icon: "error",
                title: "已锁定",
                text: "尝试次数过多，请稍后再试！",
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        const { value: inputPassword } = await Swal.fire(config.swalOptions);
        if (inputPassword === undefined) return;

        // 计算输入密码的哈希
        const inputHash = await hashPassword(inputPassword, config.salt);

        if (inputHash === config.passwords[currentPage]) {
            sessionStorage.setItem(config.tokenPrefix + currentPage, "true");
            await Swal.fire({
                icon: "success",
                title: "验证通过",
                text: "正在跳转...",
                timer: 1500,
                showConfirmButton: false
            });
            window.location.href = currentPage;
        } else {
            attempts++;
            const remaining = config.maxAttempts - attempts;
            await Swal.fire({
                icon: "error",
                title: "密码错误",
                text: remaining > 0 ? `剩余尝试次数: ${remaining}` : "已锁定",
                timer: 2000,
                showConfirmButton: false
            });
        }
    }
});


