SET NAMES UTF8;
DROP DATABASE IF EXISTS xiaofeiniu;
CREATE DATABASE xiaofeiniu CHARSET=UTF8;
USE xiaofeiniu;

/* 管理员信息表 */
CREATE TABLE xfn_admin(
    aid INT PRIMARY KEY AUTO_INCREMENT, #管理员编号
    aname VARCHAR(32) UNIQUE, #管理员用户名
    apwd VARCHAR(64) #管理员密码
);
INSERT INTO xfn_admin VALUES
(NULL, 'admin', PASSWORD('123456')),
(NULL, 'boss', PASSWORD('999999'));

/* 项目全局设置表 */
CREATE TABLE xfn_settings(
    sid INT PRIMARY KEY AUTO_INCREMENT, #编号
    appName VARCHAR(32), #应用/店家名称
    apiUrl VARCHAR(64), #数据API子系统地址
    adminUrl VARCHAR(64), #管理后台子系统地址
    appUrl VARCHAR(64), #顾客APP子系统地址
    icp VARCHAR(64), #系统备案号
    copyright VARCHAR(123) #系统版权声明
);
#桌台信息表
CREATE TABLE xfn_table(
    tid INT PRIMARY KEY AUTO_INCREMENT, #桌台编号
    tname VARCHAR(64), #桌台昵称
    type VARCHAR(16), #桌台类型，如3-4人桌
    status INT #当前状态--1空闲、2预定、3占用、0其它
);
#桌台预定信息表
CREATE TABLE xfn_reservation(
    rid INT PRIMARY KEY AUTO_INCREMENT, #信息编号
    contactName VARCHAR(64), #联系人姓名
    phone VARCHAR(16) UNIQUE, #联系电话
    contactTime BIGINT, #练习时间
    dinnerTime BIGINT #预约的用餐时间
);
#菜品分类表
CREATE TABLE xfn_category(
    cid INT PRIMARY KEY AUTO_INCREMENT, #类别编号
    cname VARCHAR(32) #类别名称
);
#菜品信息表
CREATE TABLE xfn_dish(
    did INT PRIMARY KEY AUTO_INCREMENT, #菜品编号
    title VARCHAR(32), #菜品名称/标题
    imgUrl VARCHAR(128), #图片地址
    price DECIMAL(6,2), #价格
    detail VARCHAR(128), #详细描述信息
    categoryId INT,FOREIGN KEY(categoryId) REFERENCES xfn_category(cid) #所属类别的编号
);