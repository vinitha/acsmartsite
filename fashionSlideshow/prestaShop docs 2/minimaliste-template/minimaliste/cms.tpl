<div style="width:570px;">
{if $cms}
	{if $content_only}
	<div style="text-align:left; padding:10px;">
		{$cms->content}
	</div>
	{else}
		{$cms->content}
	{/if}
{else}
	{l s='This page does not exist.'}
{/if}
{if !$content_only}
{/if}

</div>