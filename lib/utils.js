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
exports.copyToTargetAndCommit = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process = __importStar(require("child_process"));
const vscode = __importStar(require("vscode"));
/**
 * 复制文件或文件夹到指定目标目录，并根据配置执行 Git 提交
 * @param sourcePath 源文件/文件夹路径
 * @param targetDir 目标工程根目录
 * @param copyMode 复制模式：overwrite、merge、backup
 * @param gitEnable 是否执行 Git 提交
 */
function copyToTargetAndCommit(sourcePath, targetDir, copyMode, gitEnable) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.existsSync(sourcePath)) {
            throw new Error('源路径无效');
        }
        // 构造目标路径（目标目录 + 源的文件名）
        const targetPath = path.join(targetDir, path.basename(sourcePath));
        // 若目标已存在，根据复制模式进行处理
        if (fs.existsSync(targetPath)) {
            if (copyMode === 'overwrite') {
                removePath(targetPath);
            }
            else if (copyMode === 'merge') {
                // 对于文件，直接覆盖；目录将在复制过程中递归合并
                if (!fs.lstatSync(targetPath).isDirectory()) {
                    fs.unlinkSync(targetPath);
                }
            }
            else if (copyMode === 'backup') {
                // 重命名为备份文件/文件夹
                const backupPath = targetPath + '_' + new Date().getTime();
                fs.renameSync(targetPath, backupPath);
            }
            else {
                // 未知模式默认覆盖
                removePath(targetPath);
            }
        }
        // 执行复制操作
        if (fs.lstatSync(sourcePath).isDirectory()) {
            copyDirectory(sourcePath, targetPath, copyMode);
        }
        else {
            fs.copyFileSync(sourcePath, targetPath);
        }
        // 根据配置执行 Git 提交操作
        if (gitEnable) {
            if (isGitRepository(targetDir)) {
                yield gitCommit(targetDir, path.basename(sourcePath));
            }
            else {
                throw new Error('目标路径不是 Git 仓库');
            }
        }
    });
}
exports.copyToTargetAndCommit = copyToTargetAndCommit;
/**
 * 递归复制文件夹
 * @param src 源目录
 * @param dest 目标目录
 * @param copyMode 当前复制模式
 */
function copyDirectory(src, dest, copyMode) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
        const srcPath = path.join(src, entry);
        const destPath = path.join(dest, entry);
        if (fs.lstatSync(srcPath).isDirectory()) {
            copyDirectory(srcPath, destPath, copyMode);
        }
        else {
            // 文件直接复制：若存在则覆盖
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
/**
 * 递归删除文件或目录
 * @param targetPath 要删除的路径
 */
function removePath(targetPath) {
    if (fs.lstatSync(targetPath).isDirectory()) {
        fs.readdirSync(targetPath).forEach(file => {
            const curPath = path.join(targetPath, file);
            removePath(curPath);
        });
        fs.rmdirSync(targetPath);
    }
    else {
        fs.unlinkSync(targetPath);
    }
}
/**
 * 检查目录是否为 Git 仓库
 * @param dir 目录路径
 */
function isGitRepository(dir) {
    return fs.existsSync(path.join(dir, '.git'));
}
/**
 * 执行 Git 提交操作
 * @param dir Git 仓库根目录
 * @param fileName 本次操作涉及的文件名（用于 commit message）
 */
function gitCommit(dir, fileName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            child_process.execSync(`git add .`, { cwd: dir });
            child_process.execSync(`git commit -m "复制 ${fileName} 并提交"`, { cwd: dir });
            child_process.execSync(`git push`, { cwd: dir });
        }
        catch (error) {
            vscode.window.showErrorMessage(`Git 提交失败: ${error}`);
        }
    });
}
//# sourceMappingURL=utils.js.map