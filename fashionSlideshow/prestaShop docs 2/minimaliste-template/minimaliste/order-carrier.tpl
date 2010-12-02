<script type="text/javascript" src="{$base_dir}js/conditions.js"></script>
<script type="text/javascript" src="{$js_dir}layer.js"></script>
{literal}
<script type="text/javascript">
// <![CDATA[
	ThickboxI18nClose = "{l s='Close'}";
	ThickboxI18nOrEscKey = "{l s='or Esc key'}";
	tb_pathToImage = "{$img_ps_dir}loadingAnimation.gif";
//]]>
</script>
{/literal}
<script type="text/javascript">{literal}
// <![CDATA[
	/* WOWO */
    $('document').ready( function(){
        if($('#gift_cb').get(0).checked )
        {
        	$('#cart_total_wrapping').toggle();
        	$('#wrapping-more').toggle('slow');
        	{/literal}{if $cart->gift != 1}{literal}
        	$('#cart_total_global span').toggle();
        	{/literal}{/if}{literal}
        }
    });
    /* End */
//]]>
{/literal}</script>
{include file=$tpl_dir./thickbox.tpl}
{capture name=path}{l s='Shipping'}{/capture}
{include file=$tpl_dir./breadcrumb.tpl}
{assign var='current_step' value='shipping'}
{include file=$tpl_dir./order-steps.tpl}
{include file=$tpl_dir./errors.tpl}
<form id="form" action="{$base_dir}order.php" method="post" onsubmit="return acceptCGV('{l s='Please accept the terms of service before the next step.' js=1}');">
{if $virtual_cart}
	<input id="input_virtual_carrier" class="hidden" type="hidden" name="id_carrier" value="0" />
{else}
	<h3 class="carrier_title">{l s='Choose your delivery method'}</h3>
	{if $recyclablePackAllowed}
	<p>
		<input type="checkbox" class="checkbox" name="recyclable" id="recyclable" value="0" {if $recyclable == 0}checked="checked"{/if} />
		<label for="recyclable">{l s='I agree to receive my order in recycled packaging'}.</label>
	</p>
	{/if}
	{if $carriers && count($carriers)}
	<div class="table_block" style="float:left"><br />
		<table class="std">
			<thead>
				<tr>
					<th class="carrier_action first_item"></th>
					<th class="carrier_name item">{l s='Carrier'}</th>
					<th class="carrier_infos item">{l s='Information'}</th>
					<th class="carrier_price">{l s='Price'}</th>
				</tr>
			</thead>
			<tbody>
			{foreach from=$carriers item=carrier name=myLoop}
				<tr class="{if $smarty.foreach.myLoop.first}first_item{elseif $smarty.foreach.myLoop.last}last_item{/if} {if $smarty.foreach.myLoop.index % 2}alternate_item{else}item{/if}">
					<td>
						<input type="radio" class="radio" name="id_carrier" value="{$carrier.id_carrier|intval}" id="id_carrier{$carrier.id_carrier|intval}" {if $carrier.id_carrier == $checked || ($checked == 0 && $i == 0) || ($carriers|@sizeof == 1)}checked="checked"{/if} />
					</td>
					<td class="carrier_name">
						<label for="id_carrier{$carrier.id_carrier|intval}">
							{if $carrier.img}<img src="{$carrier.img|escape:'htmlall':'UTF-8'}" alt="{$carrier.name|escape:'htmlall':'UTF-8'}" />{else}{$carrier.name|escape:'htmlall':'UTF-8'}{/if}
						</label>
					</td>
					<td class="carrier_infos">{$carrier.delay|escape:'htmlall':'UTF-8'}</td>
					<td class="carrier_price">{if $carrier.price}<span class="price">{convertPrice price=$carrier.price}</span>{else}{l s='Free!'}{/if}</td>
				</tr>
			{/foreach}
			</tbody>
		</table>
	</div>
	{else}
		<p class="warning">{l s='There is no carrier available that will deliver to this address!'}</td></tr>
	{/if}
<div id="gift_div">
	<h4>{l s='Gift packing'}</h4>
	<p>
	 <input onclick="$('#wrapping-more').toggle('slow'); $('#cart_total_wrapping, #cart_total_global span').toggle();" type="checkbox" value="1" id="gift_cb" name="gift" {if $cart->gift == 1}checked="checked"{/if} style="border: none;" />
	 <label for="gift_cb">{l s='a want a gift packing'} {if $gift_wrapping_price > 0}({$gift_wrapping_price}&nbsp;euros){/if}</label>
	</p>
	<div class="clear"></div>
	<p id="wrapping-more" style="display:none;">
	{l s='add a message to your Gift packing'} :
	<textarea name="gift_message" class="wrapping_more" cols="100" rows="5">{$cart->gift_message|escape:'htmlall':'UTF-8'}</textarea>
	</p>
</div>

{if $carriers && count($carriers)}
	{else}
	<p class="warning">{l s='There is no carrier available that will deliver to this address!'}</td></tr>
{/if}
<div class="condition">	
<h3>{l s='Terms of service'}</h3>
	<p class="checkbox">
		<input type="checkbox" name="cgv" id="cgv" value="0" {if $checkedTOS}checked="checked"{/if} />
		<label for="cgv">{l s='I agree with the terms of service and I adhere to them unconditionally.'}</label> <a href="{$base_dir}cms.php?id_cms=3&amp;content_only=1&amp;TB_iframe=true&amp;width=450&amp;height=500&amp;thickbox=true" class="thickbox">{l s='(read)'}</a>
	</p>
</div>
	<p class="cart_navigation">
		<input type="hidden" name="step" value="3" />
		<a href="{$base_dir_ssl}order.php?step=1" title="{l s='Previous'}" class="buttonprecedent">&laquo; {l s='Previous'}</a>
 		<input type="submit" name="processCarrier" value="{l s='Next'} &raquo;" class="buttonorder" />
	</p>
</form>
{/if}