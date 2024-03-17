var modal = document.getElementById("myModal");
var modal2 = document.getElementById("myModal2");

var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close")[1];


document.addEventListener('DOMContentLoaded', function () {
    var storedFiles = JSON.parse(localStorage.getItem('files')) || [];
    var progressBar = document.querySelector('.progress-bar .gradient-bar');

    var uploadedImageBox = document.getElementById('uploaded-image-box');
    if (storedFiles.length > 0) {
        uploadedImageBox.innerHTML = storedFiles.map(function (file) {
            return '<div><span>' + file.name + '</span> <i class="fa fa-times delete-icon"></i></div>';
        }).join('');
        showUploadedImageBox();
    }

    function showUploadedImageBox() {
        uploadedImageBox.style.display = 'block';
        setTimeout(function () {
            uploadedImageBox.classList.add('show');
        }, 10);
    }

    function hideUploadedImageBox() {
        uploadedImageBox.classList.remove('show');
        setTimeout(function () {
            uploadedImageBox.style.display = 'none';
        }, 500);
    }

    calculateTotalSize();
    updateProgressBar();
    updateUsedSizeSum();

    function calculateTotalSize() {
        var totalSize = storedFiles.reduce(function (acc, file) {
            return acc + file.size;
        }, 0);
        localStorage.setItem('totalSize', totalSize);
        return totalSize;
    }

    function updateProgressBar() {
        var totalSize = calculateTotalSize();
        var percentage = (totalSize / (100 * 1024 * 1024)).toFixed(2) * 100;
        progressBar.style.width = percentage + '%';
    }

    function updateUsedSizeSum() {
        var totalSize = calculateTotalSize();
        var usedSizeSum = document.getElementById('storage-used');
        var usedSizeSum2 = document.getElementById('storage-used2');
        var storageLeft = document.getElementById('storage-left');
        usedSizeSum.innerHTML = (totalSize / (1024 * 1024)).toFixed(2) + ' ';
        usedSizeSum2.innerHTML = (totalSize / (1024 * 1024)).toFixed(2) + ' MB';

        var remainingMB = (100 - (totalSize / (1024 * 1024)).toFixed(2)).toFixed(2);
        storageLeft.innerHTML = remainingMB + ' <span>MB left</span>';
        if (totalSize === 0) {
            storageLeft.innerHTML = '100' + ' <span>MB left</span>';
            uploadedImageBox.innerHTML = '';
        }
    }

    document.getElementById('file-input').addEventListener('change', function () {
        var fileInput = document.getElementById('file-input');
        var file = fileInput.files[0];
        var allowedExtensions = /(\.jpg|\.jpeg|\.gif|\.png)$/i;

        if (!allowedExtensions.exec(file.name)) {
            modal.style.display = "block";
            fileInput.value = '';
            return;
        }

        var fileSizeInMB = file.size / (1024 * 1024);
        var totalSizeInMB = calculateTotalSize() / (1024 * 1024);

        if (fileSizeInMB + totalSizeInMB > 100) {
            modal2.style.display = "block";
            return;
        }

        var fileName = file.name;
        var fileType = fileName.split('.').pop();
        var truncatedFileName = fileName.length > 12 ? fileName.substring(0, 7) + '...' + fileType : fileName;
        var fileSize = file.size;
        storedFiles.push({ name: truncatedFileName, size: fileSize });

        localStorage.setItem('files', JSON.stringify(storedFiles));

        uploadedImageBox.innerHTML += '<div><span>' + truncatedFileName + '</span> <i class="fa fa-times delete-icon"></i></div>';

        uploadedImageBox.style.display = 'block';

        updateProgressBar();
        updateUsedSizeSum();

        setTimeout(function () {
            uploadedImageBox.classList.add('fade-in');
        }, 100);

        showUploadedImageBox();
        console.log(storedFiles);
    });

    document.addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('delete-icon')) {
            var clickedFileName = e.target.previousElementSibling.textContent;
            storedFiles = storedFiles.filter(function (file) {
                return file.name !== clickedFileName;
            });

            localStorage.setItem('files', JSON.stringify(storedFiles));

            e.target.parentElement.remove();

            if (storedFiles.length === 0) {
                uploadedImageBox.style.display = 'none';
            }

            if (storedFiles.length === 0) {
                hideUploadedImageBox();
            }

            updateProgressBar();
            updateUsedSizeSum();
        }
    });
});

span.onclick = function () {
    modal.style.display = "none";
}

span2.onclick = function () {
    modal2.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
}

document.getElementById("understandBtn").addEventListener("click", function () {
    modal.style.display = "none";
});

document.getElementById("understandBtn2").addEventListener("click", function () {
    modal2.style.display = "none";
});