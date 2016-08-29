/**
 * @author oldj
 * @blog http://oldj.net
 */

'use strict';

const path = require('path');
const paths = require('../libs/paths');
const {Menu, shell, ipcMain, dialog} = require('electron');
const m_lang = require('../lang');
const pref = require('./../libs/pref');

exports.init = function (sys_lang = 'en') {
    let lang = m_lang.getLang(pref.get('user_language', sys_lang));

    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: lang.new,
                    accelerator: 'CommandOrControl+N',
                    click: () => {
                        ipcMain.emit('to_add_host');
                    }
                }, {
                    type: 'separator'
                }, {
                    label: lang.import,
                    accelerator: 'Alt+CommandOrControl+I',
                    click: () => {
                        dialog.showOpenDialog({
                            title: lang.import,
                            defaultPath: path.join(paths.home_path, 'sh.json'),
                            filters: [
                                {name: 'JSON', extensions: ['json']},
                                {name: 'All Files', extensions: ['*']}
                            ]
                        }, (fns) => {
                            if (fns && fns.length > 0) {
                                ipcMain.emit('to_import', fns[0]);
                            }
                        });
                    }
                }, {
                    label: lang.export,
                    accelerator: 'Alt+CommandOrControl+E',
                    click: () => {
                        dialog.showSaveDialog({
                            title: lang.export,
                            defaultPath: path.join(paths.home_path, 'sh.json'),
                            filters: [
                                {name: 'JSON', extensions: ['json']},
                                {name: 'All Files', extensions: ['*']}
                            ]
                        }, (fn) => {
                            if (fn) {
                                ipcMain.emit('to_export', fn);
                            }
                        });
                    }
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    role: 'undo'
                },
                {
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'cut'
                },
                {
                    role: 'copy'
                },
                {
                    role: 'paste'
                },
                {
                    role: 'pasteandmatchstyle'
                },
                {
                    role: 'delete'
                },
                {
                    role: 'selectall'
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                // {
                //     label: 'Reload',
                //     accelerator: 'CmdOrCtrl+R',
                //     click (item, focusedWindow) {
                //         if (focusedWindow) focusedWindow.reload()
                //     }
                // },
                // {
                //     label: 'Toggle Developer Tools',
                //     accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                //     click (item, focusedWindow) {
                //         if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                //     }
                // },
                // {
                //     type: 'separator'
                // },
                {
                    role: 'resetzoom'
                },
                {
                    role: 'zoomin'
                },
                {
                    role: 'zoomout'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'togglefullscreen'
                }
            ]
        },
        {
            role: 'window',
            submenu: [
                {
                    role: 'minimize'
                },
                {
                    role: 'close'
                }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: lang.feedback,
                    click () {
                        shell.openExternal('https://github.com/oldj/SwitchHosts/issues');
                    }
                }, {
                    label: lang.homepage,
                    click () {
                        shell.openExternal('http://oldj.github.io/SwitchHosts/');
                    }
                }
            ]
        }
    ];

    if (process.platform === 'darwin') {
        const name = require('electron').app.getName();
        template.unshift({
            label: name,
            submenu: [
                {
                    role: 'about'
                },
                {
                    type: 'separator'
                },
                // {
                //     role: 'services',
                //     submenu: []
                // },
                // {
                //     type: 'separator'
                // },
                {
                    role: 'hide'
                },
                {
                    role: 'hideothers'
                },
                {
                    role: 'unhide'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'quit'
                }
            ]
        });
        // Edit menu.
        /*template[2].submenu.push(
         {
         type: 'separator'
         },
         {
         label: 'Speech',
         submenu: [
         {
         role: 'startspeaking'
         },
         {
         role: 'stopspeaking'
         }
         ]
         }
         );*/
        // Window menu.
        template[4].submenu = [
            {
                label: 'Close',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            },
            {
                label: 'Minimize',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            },
            {
                label: 'Zoom',
                role: 'zoom'
            },
            {
                type: 'separator'
            },
            {
                label: 'Bring All to Front',
                role: 'front'
            }
        ]
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};