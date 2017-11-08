<template>
  <ul id="tabs" class="dash-tabs">
    <li class="active">
      <a href="#draft-emails-campaign">
        Draft Emails
      </a>
    </li>
    <li>
      <a href="#finished-campaign">
        Finished Emails
      </a>
    </li>
    <li>
      <a href="#templates-campaign">
        Templates
      </a>
    </li>
  </ul>
</template>

<script>
  export default {
    mounted: function () {
      $('.dash-tabs a').click(function(e){
        e.preventDefault();
        var tabTarget = $(this).attr('href');
        $(tabTarget).fadeIn();
        $(tabTarget).siblings().hide();
        $(this).parent().addClass('active');
        $(this).parent().siblings().removeClass('active');
      });
    }

  }
</script>