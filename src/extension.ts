import * as vscode from "vscode";
import { copyToTargetAndCommit } from "./utils";
const messagePrefix = "FolderCopyPro: ";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("extension.FolderCopyPro", async (uri: vscode.Uri) => {
    if (!uri || !uri.fsPath) {
      vscode.window.showErrorMessage(`${messagePrefix}请选择一个有效的文件或文件夹`);
      return;
    }

    // 从用户设置中读取多个目标配置
    const config = vscode.workspace.getConfiguration("FolderCopyPro");
    const targets: any[] = config.get("targets", []);

    if (!targets || targets.length === 0) {
      vscode.window.showErrorMessage(`${messagePrefix}请在设置中配置至少一个复制目标`);
      return;
    }
    console.log("读取到的目标配置：", targets);
    let selectedTarget = targets[0];
    if (targets.length > 1) {
      const pick = await vscode.window.showQuickPick(
        targets.map((t) => ({
          label: t.alias || t.targetDirectory,
          description: t.targetDirectory,
          target: t,
        })),
        { placeHolder: `${messagePrefix}请选择复制目标` }
      );
      if (!pick) {
        return;
      }
      selectedTarget = pick.target;
    }

    const targetDir: string = selectedTarget.targetDirectory;
    const copyMode: string = selectedTarget.copyMode || "overwrite";
    const gitEnable: boolean = selectedTarget.git && selectedTarget.git.enable !== undefined ? selectedTarget.git.enable : true;
    const gitDir: string = selectedTarget.git && selectedTarget.git.dir ? selectedTarget.git.dir : "";
    console.log("🚀 ~ disposable ~ gitDir:", gitDir);

    // 弹出二次确认提示
    const confirm = await vscode.window.showWarningMessage(`${messagePrefix}你确定要将 '${uri.fsPath}' 复制到 '${targetDir}' 吗？`, { modal: true }, "确定");

    if (confirm !== "确定") {
      vscode.window.showInformationMessage(`${messagePrefix}操作已取消`);
      return;
    }

    try {
      await copyToTargetAndCommit(uri.fsPath, targetDir, copyMode, gitEnable, gitDir);
      vscode.window.showInformationMessage(`${messagePrefix}成功复制到 ${targetDir} 并${gitEnable ? "提交 Git" : "完成操作"}！`);
    } catch (error: any) {
      vscode.window.showErrorMessage(`${messagePrefix}操作失败: ${error.message || error}`);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
