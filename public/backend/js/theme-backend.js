tinymce.init({
    selector : ".tinymce_full",
    height: 300,
    theme: 'modern',
    autosave_interval: "20s",
    content_style: ".mce-content-body {font-size:13px;font-family:Arial,sans-serif !important;}",
    plugins: [
        'autosave',
        'advlist autolink lists link image charmap print preview hr anchor pagebreak',
        'searchreplace wordcount visualblocks visualchars code fullscreen',
        'insertdatetime media nonbreaking table contextmenu directionality',
        ' template paste textcolor colorpicker textpattern imagetools',
    ],
    toolbar1: 'undo redo | bold italic underline strikethrough superscript subscript | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | visualblocks fullscreen removeformat code',
    toolbar2: '| blockquote | table link unlink | image media | template formatselect fontsizeselect forecolor backcolor coulumm',
    fontsize_formats: "8px 10px 12px 14px 16px 18px 24px 30px 36px",
    block_formats: 'Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3; Header 4=h4; Header 5=h5; Div=div; Blockquote=blockquote',
    templates: [
        {title: 'Full Content Center', content: '<div class="div_custom"><div class="container text-center home_small"><h1>Title Content</h1><p>Description Content</p></div></div><p></p>'},
        { title: 'Cấu Trúc Liên Hệ', content: '<div class="list_map"><ul><li>Hồ chí minh</li><li>Địa chỉ</li><li>Điện thoại</li><li>Email</li></ul></div><p></p>'},
        { title: 'Thumbnail Right', content: '<div class="div_custom"><div class="container"><p></p><div class="row"><div class="col-lg-6"><h2>Title Content</h2><p>Description Content</p></div><div class="col-lg-6"><img src="https://placehold.it/500x300?text=thumbs"></div></div><p></p></div></div><p></p>'},
        { title: 'Thumbnail Left', content: '<div class="div_custom bg_white"><div class="container"><p></p><div class="row"><div class="col-lg-6"><img src="https://placehold.it/500x300?text=thumbs"></div><div class="col-lg-6"><h2>Title Content</h2><p>Description Content</p></div><p></p></div></div><p></p>'},
        { title: 'Content Project', content: '<div class="row"><div class="col-lg-12"><img src="https://placehold.it/800x350?text=thumbs" alt=""></div></div><ul class="list_project"><li><img src="https://placehold.it/400x170?text=thumbs" alt=""><p>Title</p></li><li><img src="https://placehold.it/400x170?text=thumbs" alt=""><p>Title</p></li></ul>'},
        { title: 'Content Project Item', content: '<li><img src="https://placehold.it/400x170?text=thumbs" alt=""><p>Title</p></li>'},
        { title: 'Table Price', content: '<div class="table_price"><div class="table_price_header"><h3>Tên Gói</h3><h3>1.000.000</h3></div><div class="table_price_content"><p>Thời gian hoàn thành 1 ngày</p><p>Thiết kế giao diện website theo mẫu</p></div><div class="table_price_footer"><button class="btn btn-primary">Đăng Ký</button></div></div>'},
        { title: 'Background White', content: '<div class="bg_color_white"><p></p></div>'},
        { title: 'Background Grey', content: '<div class="bg_color_grey"><p></p></div>'},
    ],
    setup: function(editor) {
        editor.addButton('coulumm', {
            type: 'menubutton',
            //text: 'Layout',
            icon: true,
            image: 'https://getbootstrap.com/apple-touch-icon.png',
            tooltip: "Giao diện bootstrap",
            menu: [{
                text: 'Columm 1',
                onclick: function() {
                    editor.insertContent('<div class="container"><div class="row"><div class="col-md-12"><p>Content here</p></div></div></div>');
                }
                }, {
                text: 'Columm 1-1',
                onclick: function() {
                    editor.insertContent('<div class="container"><div class="row"><div class="col-md-6"><p>Content here</p></div><div class="col-md-6"><p>Content here</p></div></div></div>');
                }
                }, {
                text: 'Columm 1-1-1',
                onclick: function() {
                    editor.insertContent('<div class="container"><div class="row"><div class="col-md-4"><p>Content here</p></div><div class="col-md-4"><p>Content here</p></div><div class="col-md-4"><p>Content here</p></div></div></div>');
                }
                }, {
                text: 'Columm 1-1-1',
                onclick: function() {
                    editor.insertContent('<div class="container"><div class="row"><div class="col-md-4"><p>Content here</p></div><div class="col-md-4"><p>Content here</p></div><div class="col-md-4"><p>Content here</p></div></div></div>');
                }
            }]
        });
    },
    visualblocks_default_state: true,
    end_container_on_empty_block: true,
});
tinymce.init({
    selector : ".tinymce_small",
    height: 150,
    theme: 'modern',
    autosave_interval: "20s",
    menubar: false,
    content_style: ".mce-content-body {font-size:13px;font-family:Arial,sans-serif;}",
    plugins: [
        'autosave',
        'advlist autolink lists link hr anchor pagebreak',
        'wordcount visualblocks visualchars code',
        'nonbreaking save contextmenu directionality',
        'paste textcolor colorpicker textpattern imagetools '
    ],
    toolbar1: 'undo redo | bold italic underline strikethrough sub | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link unlink removeformat',
});