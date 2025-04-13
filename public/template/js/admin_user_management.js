function getAllUsersPaginate(page, search) {
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", localStorage.getItem('token'));
        },
        url: "/admin/panel/user-management/list",
        type: "GET",
        data: {
            page: page,
            search: search
        },
        encode: true,
        success: function (response) {
            console.log(response);
            if(response.data?.totalUsers > 0){
                $('.dataTable-info').html(`Total ${response.data?.totalUsers} users with ${response.data?.totalPages} pages`);
                $('.dataTable-info').attr('data', response.data?.totalUsers);
                $('.dataTable-info').attr('page', response.data?.currentPage);
                $('.dataTable-info').attr('totalPages', response.data?.totalPages);
                $('.dataTable-info').attr('search', search);
                $('.dataTables-empty').hide();
            }else{
                $('.dataTable-info').html('');
                $('.dataTables-empty').show();
            }
            $('#datatable-basic tbody').empty();
            $('.dataTable-top').remove();
            $('.pagination-list').empty();
            response.data?.users.forEach((user) => {
                $('#datatable-basic tbody').append(`
                   <tr>
                    <td class="text-sm font-weight-normal">${user.id_user}</td>
                    <td class="text-sm font-weight-normal">${user.username}</td>
                    <td class="text-sm font-weight-normal">
                        <p class="text-sm font-weight-normal mb-0">
                            <span class="badge badge-md 
                            ${user.active == 1 ? 'bg-gradient-success' : 'bg-gradient-danger'}">
                            ${user.active ? 'Active' : 'Inactive'}
                            </span>
                        </p>
                    </td>
                    <td class="text-sm font-weight-normal">${user.created_at}</td>
                    <td class="text-sm font-weight-normal">${user.updated_at}</td>
                    <td class="text-sm font-weight-normal">
                        <a href="/admin/panel/user-management/user/${user.username}" class="text-sm font-weight-normal mb-0">
                            <span class="badge badge-md bg-gradient-warning cursor-pointer" data="${user.username}">Edit</span>
                        </a>
                    </td>
                  </tr>                 
               `)
            })
            // Pagination
            if(response.data?.totalPages > 1){
                if(response.data?.currentPage == 1){
                    
                    $('.pagination-list').append(`
                        <li class="active" ><a class="avatar avatar-sm rounded-circle border border-secondary" href="#" data-page="1">1</a></li>
                    `)
                    for(let i = 2; i <= response.data?.totalPages; i++){
                        $('.pagination-list').append(`
                            <li><a class="avatar avatar-sm rounded-circle border border-secondary" href="#" data-page="${i}">${i}</a></li>
                        `)
                        if (i == 3){
                            break;
                        }
                    }
                    $('.pagination-list').append(`
                            <li><a class="avatar avatar-sm rounded-circle border border-secondary" href="#" data-page="2">›</a></li>
                    `)
                }
                if(response.data?.currentPage == response.data?.totalPages){
                    $('.pagination-list').append(`
                        <li><a class="avatar avatar-sm rounded-circle border border-secondary" href="#" data-page="${response.data?.currentPage - 1}">‹</a></li>
                    `)
                    for(let i = response.data?.totalPages - 2; i <= response.data?.totalPages; i++){
                        if(i == 0) {
                            continue;
                        }
                        $('.pagination-list').append(`
                            <li><a class="avatar avatar-sm rounded-circle border border-secondary" href="#" data-page="${i}">${i}</a></li>
                        `)
                        if (i == response.data?.totalPages -1){
                            break;
                        }
                    }
                    $('.pagination-list').append(`
                        <li class="active" ><a class="avatar avatar-sm rounded-circle border border-secondary" href="#" data-page="${response.data?.currentPage}">${response.data?.currentPage}</a></li>
                    `)
                }

                if(response.data?.currentPage != 1 && response.data?.currentPage != response.data?.totalPages){
                    $('.pagination-list').append(`
                        <li><a class="avatar avatar-sm rounded-circle border border-secondary" href="#" data-page="${response.data?.currentPage - 1}">‹</a></li>
                    `)
                    $('.pagination-list').append(`
                        <li><a class="avatar avatar-sm rounded-circle border border-secondary" href="#" data-page="${response.data?.currentPage - 1}">${response.data?.currentPage - 1}</a></li>
                    `)
                    $('.pagination-list').append(`
                        <li class="active"><a class="avatar avatar-sm rounded-circle border border-secondary" href="#" data-page="${response.data?.currentPage}">${response.data?.currentPage}</a></li>
                    `)
                    $('.pagination-list').append(`
                        <li><a class="avatar avatar-sm rounded-circle border border-secondary" href="#" data-page="${response.data?.currentPage*1 + 1}">${response.data?.currentPage*1 + 1}</a></li>
                    `)
                    $('.pagination-list').append(`
                        <li><a class="avatar avatar-sm rounded-circle border border-secondary" href="#" data-page="${response.data?.currentPage*1 + 1}">›</a></li>
                    `)
                }
            }
        },
        error: function (error) {
            console.log(error.responseJSON.message);
            alert(error.responseJSON.message);
        }
    });
}

getAllUsersPaginate(1, null);

$(document).on('click', '.pagination-list li a', (element) => { 
    let page = element.currentTarget.getAttribute('data-page');
    let search = $('.dataTable-info').attr('search');
    getAllUsersPaginate(page, search);
})  

$(document).on('keyup', 'input', (element) => {
    let debounceTimer;
    clearTimeout(debounceTimer);
    let search = element.currentTarget.value;
    debounceTimer = setTimeout(() => {
        getAllUsersPaginate(1, search);
    }, 500);
}) 

const dataTableBasic = new simpleDatatables.DataTable("#datatable-basic", {
    searchable: false,
    fixedHeight: false,
    sortable: false,
    perPageSelect: false,
    paging: false

})