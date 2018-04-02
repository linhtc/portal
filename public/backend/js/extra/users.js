try{
    for(let gIndex=0; gIndex<_groupMap.length; gIndex++){
        _groupIndex[_groupMap[gIndex].key] = gIndex;
    }
} catch (exx){
    console.log(exx.message);
}
let selectBag = {};
if(_permission.export !== undefined){
    _buttons.push({
        extend: 'csvHtml5',
        text: 'Tải',
        exportOptions: {
            columns: [2, 3, 4, 5, 6, 7, 8]
        }
    });
}
if (_permission.import !== undefined) {
    _buttons.push({
        text: 'Nhập',
        action: function (e, dt, node, config) {
            e.preventDefault();
            _this = node;
            $("#importFile").val('').click();
        }
    });
    _buttons.push({
        text: 'Mẫu',
        action: function (e, dt, node, config) {
            e.preventDefault();
            window.location = '/public/backend/files/UserTheme.csv';
        }
    });
}
if (_permission.create !== undefined) {
    _buttons.push({
        text: 'Tạo',
        action: function (e, dt, node, config) {
            $('.params:input:not([type=radio])').val('');
            $("#avatarFile").val('');
            $('#username').attr('readonly', false);
            $('#password').attr('required', true);
            $('#infoModalTitle').text('Thêm mới');
            $('#infoError').text('').hide();
            _dialog.lastFocusedTarget = e.target;
            _dialog.show();
        }
    });
}
if (_permission.remove !== undefined) {
    _buttons.push({
        text: 'Xóa',
        action: function (e, dt, node, config) {
            let rowSelected = $('#infoTable').find('.selected td:nth-child(2)');
            if (rowSelected.length < 1) {
                $('.notifyjs-wrapper').remove();
                node.notify('Chọn ít nhất 1 dòng. Ctrl + click để chọn nhiều!', {className: 'error', position: 'top center'});
            } else {
                swal({
                    title: "Chắc chắn xóa?",
                    text: "Dữ liệu đã xóa sẽ không thể phục hồi!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Xác nhận",
                    cancelButtonText: "Hủy bỏ",
                    closeOnConfirm: false,
                    closeOnCancel: true
                }, function (isConfirm) {
                    if (isConfirm) {
                        let list = [];
                        rowSelected.each(function () {
                            let item = _infoTable.row(this).data();
                            list.push(item[1]);
                        });
                        if (list.length > 0) {
                            $.ajax({
                                type: 'post',
                                url: _thatUrl+'remove',
                                data: {list: list.toString()},
                                dataType: 'json',
                                success: function (result) {
                                    if (result.status === 1) {
                                        _infoTable.ajax.reload();
                                        swal("Deleted!", "Dữ liệu đã được xóa!", "success");
                                    } else {
                                        swal("Cancelled", result.message, "error");
                                    }
                                },
                                error: function (XMLHttpRequest) {
                                    swal("Cancelled", XMLHttpRequest.statusText, "error");
                                }
                            });
                        }
                    } else {
                        swal("Cancelled", "Your imaginary file is safe :)", "error");
                    }
                });
            }
        }
    });
}
if (_permission.edit !== undefined) {
    _buttons.push({
        text: 'Sửa',
        action: function (e, dt, node, config) {
            let rowSelected = $('#infoTable').find('.selected td:nth-child(2)');
            if (rowSelected.length !== 1) {
                $('.notifyjs-wrapper').remove();
                node.notify('Chọn duy nhất 1 dòng!', {className: 'error', position: 'top center'});
            } else {
                rowSelected.each(function () {
                    let item = _infoTable.row(this).data();
                    $.ajax({
                        type: 'post',
                        url: _thatUrl+'data',
                        data: {_id: item[1]},
                        dataType: 'json',
                        success: function (result) {
                            if (result.status === 1) {
                                let item = result.item;
                                Object.keys(item).forEach(function (key) {
                                    if (key === 'gender') {
                                        if (item[key] === 'Nam') {
                                            $("#male").prop("checked", true);
                                        } else {
                                            $("#female").prop("checked", true);
                                        }
                                    } else if(key === 'group') {
                                        if(_groupIndex[item[key]] !== undefined){
                                            selectBag[key].selectedIndex = _groupIndex[item[key]]
                                        }
                                    } else {
                                        let keyID = '#' + key;
                                        $(keyID).val(item[key]);
                                        $(keyID).parent().find('label').addClass('mdc-floating-label--float-above');
                                    }
                                });
                                $("#avatarFile").val('');
                                $('#password').attr('required', false);
                                $('#username').attr('readonly', true);
                                $('#infoModalTitle').text('Sửa lại');
                                $('#infoError').text('').hide();
                                _dialog.lastFocusedTarget = e.target;
                                _dialog.show();
                            } else {
                                node.notify(result.message, {className: 'error', position: 'top center'});
                            }
                        },
                        error: function (XMLHttpRequest) {
                            node.notify(XMLHttpRequest.statusText, {className: 'error', position: 'top center'});
                        }
                    });
                    return true;
                });
            }
        }
    });
}

document.getElementById('iframe').onload = function() {
    let win = document.getElementById("iframe").contentWindow;
    win.postMessage('Hello', '*');
};
function receiveMessage(event) {
    if(event.data.status && event.data.file){
        _dialogFile.close();
        let avatarID = '#avatar';
        $(avatarID).val('/public/files'+event.data.file.relPath);
        $(avatarID).parent().find('label').addClass('mdc-floating-label--float-above');
    }
}
window.addEventListener("message", receiveMessage, false);

$('#saveInfo').click(function () {
    let info = {};
    let allow = true;
    let params = $('.params');
    params.each(function () {
        if (this.required && this.value.length < 1) {
            let msgLabel = $(this).parent().find('.mdc-floating-label');
            if(msgLabel.length > 0){
                msgLabel = msgLabel[0].textContent+': ';
            } else{
                msgLabel = '';
            }
            let msgControl = this.getAttribute('aria-controls');
            $('#infoError').text(msgLabel+''+$('#'+msgControl).text()).hide().show(500);
            allow = false;
            return allow;
        }
        if (this.type === undefined && this.getAttribute('role') === 'listbox') {
            if(selectBag[this.id]['selectedOptions'].length > 0){
                info[this.id] = selectBag[this.id]['selectedOptions'][0]['attributes']['value']['nodeValue'];
            } else{
                info[this.id] = '';
            }
        } else if (this.type === 'radio') {
            if(this.checked){
                info[this.name] = this.value;
            }
        } else {
            info[this.id] = this.value;
        }
    });
    if (allow) {
        $('#infoError').text('').hide();
        $('#saveInfo').notify("Hệ thống đang xử lý", {className: 'info', position: 'right top'});
        $.ajax({
            type: 'post',
            url: _thatUrl + 'save',
            data: info,
            dataType: 'json',
            success: function (result) {
                if (result.status === 1) {
                    _infoTable.ajax.reload();
                    $('#saveInfo').notify(result.message, {className: 'success', position: 'right top'});
                    _dialog.close();
                } else {
                    $('#infoError').text(result.message).show(500);
                    $('#saveInfo').notify(result.message, {className: 'error', position: 'right top'});
                }
            },
            error: function (XMLHttpRequest) {
                $('#infoError').text(XMLHttpRequest.statusText).show(500);
                $('#saveInfo').notify(result.message, {className: 'error', position: 'right top'});
            }
        });
    }
});
$("#avatarFile").change(function (e) {
    files = e.target.files;
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        formData.append('file', file, file.name);
    }
    let avatarID = '#avatar';
    $.ajax({
        url: '/backend/cdn/single',
        type: 'post',
        data: formData,
        success: function (result) {
            if(result.status === 1){
                $(avatarID).val(result.path);
                $(avatarID).parent().find('label').addClass('mdc-floating-label--float-above');
            } else{
                $(avatarID).val('');
                $(avatarID).parent().find('label').removeClass('mdc-floating-label--float-above');
            }
        },
        error: function (err) {
            console.log(err);
            $('#avatar').val('');
            $(avatarID).parent().find('label').removeClass('mdc-floating-label--float-above');
        },
        cache: false,
        contentType: false,
        processData: false
    });
});
$("#importFile").change(function (e) {
    if(_this !== null){
        $(_this).block({message:'<i class="fa fa-spinner fa-spin text-white"></i>', css:{backgroundColor:'none', border:'none'}});
    }
    files = e.target.files;
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        formData.append('file', file, file.name);
    }
    formData.append('collection', 'users');
    $.ajax({
        url: '/backend/cdn/import',
        type: 'post',
        data: formData,
        success: function (result) {
            $(_this).unblock();
            if(result.status === 1){
                _infoTable.ajax.reload();
                $.notify({
                    title: "Thành công: ",
                    message: result.message,
                    icon: 'fa fa-check'
                }, {
                    type: "success",
                    delay: 1000
                });
            } else{
                $.notify({
                    title: "Lỗi: ",
                    message: result.message,
                    icon: 'fa fa-check'
                }, {
                    type: "danger",
                    delay: 1000
                });
            }
        },
        error: function (err) {
            $(_this).unblock();
            $.notify({
                title: "Lỗi: ",
                message: err.statusText,
                icon: 'fa fa-check'
            }, {
                type: "danger",
                delay: 1000
            });
        },
        cache: false,
        contentType: false,
        processData: false
    });
});
$(document).ready(function () {
    const MDCSelect = mdc.select.MDCSelect;
    const selects = document.querySelectorAll('.mdc-select');
    for (let i = 0; i < selects.length; i++) {
        let sel = new MDCSelect(selects[i]);
        selectBag[sel.root_.id] = sel;
    }
    const tfRoot = document.querySelectorAll('.mdc-text-field');
    for (let i = 0; i < tfRoot.length; i++) {
        new mdc.textField.MDCTextField(tfRoot[i]);
    }
    mdc.dialog.MDCDialog.attachTo(document.querySelector('.mdc-dialog'));
    _dialog = new mdc.dialog.MDCDialog(document.querySelector('#mdc-dialog-default'));
    _dialog.listen('MDCDialog:accept', function () {
        console.log('accepted');
    });
    _dialog.listen('MDCDialog:cancel', function () {
        console.log('canceled');
    });
    _dialogFile = new mdc.dialog.MDCDialog(document.querySelector('#mdc-dialog-file'));
    _infoTable = $('#infoTable').DataTable({
        dom: 'Bfrtip',
        bAutoWidth: false,
        // responsive: true,
        processing: true,
        serverSide: true,
        // ajax: {
        //     url: _thatUrl+'data',
        //     type: 'POST',
        //     data: {}
        // },
        ajax: $.fn.dataTable.pipeline({
            url: _thatUrl+'data',
            pages: 5, // number of pages to cache,
            data: {test: 123}
        }),
        fnInitComplete: function (oSettings) {
            setTimeout(function () {
                // language=JQuery-CSS
                $('.table tfoot th').each(function (index) {
                    if (index < 1) {
                        return;
                    }
                    let title = $(this).text();
                    let date = new Date;
                    let element = document.createElement("INPUT");
                    element.type = 'text';
                    element.classList.add('filter-data');
                    element.placeholder = 'Lọc theo ' + title;
                    element.title = 'Lọc theo ' + title;
                    element.id = Math.random() + '_' + date.getUTCMilliseconds();
                    $(this).html(element);
                });
                _infoTable.columns().every(function (index) {
                    let that = this;
                    $('input', this.footer()).val('');
                    $('input', this.footer()).on('keyup', function (e) {
                        if(e.keyCode === 13){
                            if(_infoTable !== null){
                                _infoTable.clearPipeline().draw();
                            }
                        }
                        // let tmpID = $(this).attr('id');
                        // table.draw();
                        // if (that.search() !== this.value) {
                        //     that.search(this.value).draw();
                        // }
                    });
                });
                $('.table').wrapAll('<div class="table-responsive"></div>');
            }, 10);
        },
        columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0
        }, {
            targets: [1],
            visible: false
        }, {
            searchable: false,
            targets: 1
        }],
        select: {
            style: 'os'
        },
        order: [[2, 'desc']],
        pagingType: 'simple_numbers',
        buttons: _buttons
    });
    if($(window).height() < 768){
        $('.mdc-dialog__surface .mdc-dialog__body--scrollable').css('max-height', Math.floor($(window).height()*0.4));
    }
});