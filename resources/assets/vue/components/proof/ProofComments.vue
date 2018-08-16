<template id="proof-comments">
    <div class="proof-comments-container">
        <div class="proof-comment" v-for="comment in comments" :class="('decision' in comment) ? comment.decision : ''">
            <h4>{{ comment.display_name }} said:</h4>
            <p>{{ comment.content }}</p>
            <p class="proof-comment-date">{{ comment.created_at }}</p>
        </div>
        <div class="proof-new-comment">
            <span class="proof-new-comment-error" v-if="error">{{ error }}</span>
            <textarea
                class="form-control"
                placeholder="Insert your comment here..."
                rows="3"
                v-if="!campaignFinished"
                v-model="newComment"
            ></textarea>
            <button
                class="btn btn-default beta-btn-primary pull-right"
                :class="{'ajax-loader-small': !canSubmit}"
                :disabled="!canSubmit"
                v-if="!campaignFinished"
                v-on:click="submitComment()"
            >Submit</button>
        </div>
    </div>
</template>

<script>
    import proofService from '../../services/proof';

    export default {
        name: 'proofComments',
        data() {
            return {
                canSubmit: true,
                error: '',
                newComment: '',
                comments: []
            };
        },
        props: ['token', 'campaignFinished'],
        created: function() {
            // Get a list of comments
            this.getComments();
        },
        methods: {
            commentType: function(comment) {
                return {
                    'approve' : ('decision' in comment && comment.decision === 'approve-with-comments'),
                    'reject' : ('decision' in comment && comment.decision === 'reject-with-comments')
                }
            },
            getComments: function() {
                var _this = this;
                proofService.getComments(_this.token).then((response) => {
                    if (response.status === 'success') {
                        _this.comments = response.data.comments;
                    }
                });
            },
            submitComment: function() {
                var _this = this;
                _this.error = '';
                if (_this.newComment.length > 0) {
                    _this.canSubmit = false;
                    var data = {
                        comment: _this.newComment
                    };
                    proofService.postComment(_this.token, data).then((response) => {
                        if (response.status === 'success') {
                            _this.getComments();
                            _this.newComment = '';
                        } else {
                            _this.error = 'Something went wrong. Please try again.';
                        }
                        _this.canSubmit = true;
                    });
                } else {
                    _this.error = 'Please write a comment.';
                }
            }
        }
    };
</script>

<style lang="scss">
    .proof-comments-container {
        width: 100%;
        padding-left: 15px;

        .proof-comment {
            background: #ffffff;
            border-radius: 2px;
            color: #666666;
            margin-bottom: 10px;
            padding: 10px;

            h4 {
                color: #666666;
                font-size: 17px;
                font-weight: 300;
                margin-top: 0px;
            }
            p {
                color: #666666;
                font-size: 14px;
                font-style: italic;
            }
            .proof-comment-date {
                border-top: 1px solid #dddddd;
                color: #bbbbbb;
                font-size: 12px;
                margin: 0;
                text-align: right;
                padding: 8px 0 0 0;
            }
        }

        .approve-with-comments {
            background: #7BAF73;

            h4{
                color: #ffffff;
            }

            p{
                color: #ffffff;
            }

            .proof-comment-date {
                border-top: 1px solid #ffffff;
                color: #ffffff;
            }
        }

        .reject-with-comments {
            background: #CE5F5F;

            h4{
                color: #ffffff;
            }

            p{
                color: #ffffff;
            }

            .proof-comment-date {
                border-top: 1px solid #ffffff;
                color: #ffffff;
            }
        }

        .proof-new-comment {
            textarea {
                border-radius: 2px;
                font-size: 14px;
                margin-bottom: 10px;
                padding: 10px;
                resize: none;
                border: 1px solid #e4e4e4;
            }
        }

        .proof-new-comment-error {
            color: #CE5F5F;
            padding: 10px;
        }
    }
</style>
