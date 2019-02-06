<?php

namespace Stensul\Models;

class Reviewer extends User
{
	/**
	 * Shows a reviewer's name with a message if the user has been deleted
	 *
	 * @return string
	 */
	public function getDisplayNameAttribute()
	{
		return $this->getFullNameAttribute() . ($this->trashed() ? ' (deleted)' : '');
	}
}