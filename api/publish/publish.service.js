import path from 'path';
import URL from 'url';
import moment from 'moment';
import mkdirp from 'mkdirp';
import git from 'simple-git/promise';

import * as config from '../../service/config';
import { readJSON, generateMd5String } from '../../service/utils';
 
export async function initPublish (publish) {
    publish.localPath = publish.git.split('/').pop() + moment.format('YYYYMMDD');
    
    const localPath = path.join(config.projectDir, publish.localPath);
    mkdirp.sync(config.projectDir);

    await git().clone(publish.git, localPath);

    const pkgPath = path.join(localPath, 'package.json');
    const pkg = readJSON(pkgPath);
    const publishConfig = pkg.publishConfig;

    if (!publishConfig) {
        throw new Error('package.json缺少publishConfig字段');
    } 

    let projectPath = path.join(generateMd5String(publish.git), '/');
    const projectResourcesPath = path.join('todo ftp.project', projectPath);

    publishConfig.prodResourcesPath = URL.resolve(ftp.prodResources.path, projectResourcesPath);
    publishConfig.testResourcesPath = URL.resolve(ftp.testResources.path, projectResourcesPath);
    publishConfig.testHtmlPath = URL.resolve(ftp.testHtml.path, projectPath);
    
    if (publish.prodPath) {
        // 如果项目填写了正式路径，使用正式路径作为项目线上路径
        publishConfig.testHtmlPath = URL.resolve(ftp.testHtml.path, publish.prodPath);
        publishConfig.prodHtmlPath = URL.resolve(ftp.prodHtml.path, publish.prodPath);
    }
    
    // 将内容写到文件中
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

    const gitObj = git(localPath);

    await gitObj.add('package.json')
        .then(() => gitObj.commit('发布系统：设置项目发布路径'))
        .then(() => gitObj.push('origin', 'master'));

    return pkg;
}
