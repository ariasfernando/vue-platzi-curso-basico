<?php

namespace Stensul\Providers\Cdn;

/*
|--------------------------------------------------------------------------
| Cdn interface
|--------------------------------------------------------------------------
|
| This interface have the mandatory structure to implement new cdn provides, add new methods on demand.
|
*/

interface CdnInterface
{
    /**
     * Delete item.
     *
     * @return string path prefix
     */
    public function delete($params);
}
