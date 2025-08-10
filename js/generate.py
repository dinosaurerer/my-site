import hashlib

def generate_hash(password: str, salt: str = "a1b2c3d4") -> str:
    # 拼接盐和密码
    salted = salt + password
    # 计算 SHA-256 哈希
    hash_hex = hashlib.sha256(salted.encode("utf-8")).hexdigest()
    return hash_hex

if __name__ == "__main__":
    # 生成三个页面的密码哈希
    print("articles.html:", generate_hash("1007"))  # 文章页面
    print("jie.html:", generate_hash("5800"))       # 杰哥页面
    print("peizi.html:", generate_hash("1500"))     # 胚胚纪实
