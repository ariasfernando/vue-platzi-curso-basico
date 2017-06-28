<modal
    :size="'lg'"
    v-if="showModal"
    v-on:close="closeProofModal()"
>
    <div slot="header">
        <h4>Who would you like to send this email to for review?</h4>
    </div>
    <div slot="body">
        <div class="send-proof">
            <form name="send-proof-form" id="send-proof-form" action="">
                <div class="form-group">
                    <label>Name</label>
                    <div class="input-group">
                        <select name="proof-users" class="form-control">
                            <option v-for="user in users" :value="user">@{{user}}</option>
                        </select>
                        <span class="input-group-btn">
                            <button type="button" class="btn btn-default btn-reviewer-add">Add</button>
                        </span>
                    </div>
                </div>
                <table class="table table-condensed" id="reviewers-table">
                    <thead>
                        <tr>
                            <th class='col-xs-5'>Email</th>
                            <th class='col-xs-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </form>
        </div>
    </div>
    <div slot="footer">
        <button class="btn btn-default" id="btn-send-proof">Send email for review</button>
    </div>
</modal>
