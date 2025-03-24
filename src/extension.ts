import * as vscode from 'vscode';
import { copyToTargetAndCommit } from './utils';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.copyToTarget', async (uri: vscode.Uri) => {
    if (!uri || !uri.fsPath) {
      vscode.window.showErrorMessage('请选择一个有效的文件或文件夹');
      return;
    }
    
    // 从用户设置中读取多个目标配置
    const config = vscode.workspace.getConfiguration('copyToTarget');
    const targets: any[] = config.get('targets', []);

    if (!targets || targets.length === 0) {
      vscode.window.showErrorMessage('请在设置中配置至少一个复制目标');
      return;
    }
    console.log("读取到的目标配置：", targets);
    let selectedTarget = targets[0];
    if (targets.length > 1) {
      const pick = await vscode.window.showQuickPick(
        targets.map(t => ({
           label: t.alias || t.targetDirectory,
           description: t.targetDirectory,
           target: t
        })),
        { placeHolder: '请选择复制目标' }
      );
      if (!pick) {
         return;
      }
      selectedTarget = pick.target;
    }
    
    const targetDir: string = selectedTarget.targetDirectory;
    const copyMode: string = selectedTarget.copyMode || 'overwrite';
    const gitEnable: boolean = selectedTarget.git && selectedTarget.git.enable !== undefined ? selectedTarget.git.enable : true;
    
    try {
      await copyToTargetAndCommit(uri.fsPath, targetDir, copyMode, gitEnable);
      vscode.window.showInformationMessage(`成功复制到 ${targetDir} 并${gitEnable ? '提交 Git' : '完成操作'}！`);
    } catch (error: any) {
      vscode.window.showErrorMessage(`操作失败: ${error.message || error}`);
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
