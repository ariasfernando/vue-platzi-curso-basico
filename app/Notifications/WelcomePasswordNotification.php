<?php

namespace Stensul\Notifications;

use Stensul\Notifications\ResetPasswordNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class WelcomePasswordNotification extends ResetPasswordNotification
{
    /**
     * Get the mail representation of the notification.
     *
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail()
    {
        return (new MailMessage)
            ->subject(env('MAIL_WELCOME_SUBJECT', 'Welcome to stensul!'))
            ->view('emails.password_welcome', ['token' => $this->token, 'name' => $this->name]);
    }
}
