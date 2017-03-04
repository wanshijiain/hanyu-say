## 接口规范
### 命名规范

1. 采用驼峰式命令规则。
2. 采用通用缩写规则，否则不缩写。

### 参数规范

1. 参数个数不能大于3个，否则采用对象传参。
1. 只一个参数且带回调的接口定义为: `function funName(varName, secc[, fail])`。
1. 多个参数且带回调的接口定义为: `function funName(options, secc[, fail])`。
1. 带回调的接口，统一返回Jquery Deferred对象，方便链式调用。