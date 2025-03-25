"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const utils_1 = require("./utils");
function activate(context) {
    const disposable = vscode.commands.registerCommand('extension.FolderCopyPro', (uri) => __awaiter(this, void 0, void 0, function* () {
        if (!uri || !uri.fsPath) {
            vscode.window.showErrorMessage('请选择一个有效的文件或文件夹');
            return;
        }
        // 从用户设置中读取多个目标配置
        const config = vscode.workspace.getConfiguration('FolderCopyPro');
        const targets = config.get('targets', []);
        if (!targets || targets.length === 0) {
            vscode.window.showErrorMessage('请在设置中配置至少一个复制目标');
            return;
        }
        console.log("读取到的目标配置：", targets);
        let selectedTarget = targets[0];
        if (targets.length > 1) {
            const pick = yield vscode.window.showQuickPick(targets.map(t => ({
                label: t.alias || t.targetDirectory,
                description: t.targetDirectory,
                target: t
            })), { placeHolder: '请选择复制目标' });
            if (!pick) {
                return;
            }
            selectedTarget = pick.target;
        }
        const targetDir = selectedTarget.targetDirectory;
        const copyMode = selectedTarget.copyMode || 'overwrite';
        const gitEnable = selectedTarget.git && selectedTarget.git.enable !== undefined ? selectedTarget.git.enable : true;
        const gitDir = selectedTarget.git && selectedTarget.git.dir ? selectedTarget.git.dir : '';
        console.log('🚀 ~ disposable ~ gitDir:', gitDir);
        try {
            yield (0, utils_1.copyToTargetAndCommit)(uri.fsPath, targetDir, copyMode, gitEnable, gitDir);
            vscode.window.showInformationMessage(`成功复制到 ${targetDir} 并${gitEnable ? '提交 Git' : '完成操作'}！`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`操作失败: ${error.message || error}`);
        }
    }));
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map