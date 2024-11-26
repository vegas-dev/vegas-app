<div class="container">
    <h1 class="mb-3 mt-3">VGModal</h1>
    <hr class="mb-4">

    <div class="row">
        <div class="col-lg-3">
            <ul class="list-group">
                <li class="list-group-item"><button class="btn btn-primary" data-vg-target="#exampleModal" data-vg-toggle="modal">Открыть модальное окно</button></li>
            </ul>
        </div>
        <div class="col-lg-9">
<!--            <h3>Как это работает</h3>-->
            <div style="height: 2000px"></div>
        </div>
    </div>
</div>


<div class="vg-modal fade" id="exampleModal" tabindex="-1" aria-hidden="true">
    <div class="vg-modal-dialog">
        <div class="vg-modal-content">
            <div class="vg-modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">New message</h1>
<!--                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>-->
            </div>
            <div class="vg-modal-body">
                <form>
                    <div class="mb-3">
                        <label for="recipient-name" class="col-form-label">Recipient:</label>
                        <input type="text" class="form-control" id="recipient-name">
                    </div>
                    <div class="mb-3">
                        <label for="message-text" class="col-form-label">Message:</label>
                        <textarea class="form-control" id="message-text"></textarea>
                    </div>
                </form>
            </div>
            <div class="vg-modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Send message</button>
            </div>
        </div>
    </div>
</div>