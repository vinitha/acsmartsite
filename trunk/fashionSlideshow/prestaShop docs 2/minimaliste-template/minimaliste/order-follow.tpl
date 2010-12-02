{capture name=path}<a href="my-account.php">{l s='My account'}</a><span class="navigation-pipe">{$navigationPipe}</span>{l s='Return Merchandise Authorization (RMA)'}{/capture}
{include file=$tpl_dir./breadcrumb.tpl}

<h2>
  {l s='Return Merchandise Authorization (RMA)'}
  <a href="{$base_dir}index.php?mylogout" id="logout" title="{l s='log out'}">{l s='Sign out'}</a>
</h2>
<div id="myaccountnav">
		<ul>
	        <li class="bnthyshome"><a href="{$base_dir_ssl}my-account.php">{l s='Home'}</a></li>
			<li><a href="{$base_dir_ssl}history.php" title="">{l s='orders'}</a></li>
			<li><a href="{$base_dir_ssl}order-slip.php" title="">{l s='credit slips'}</a></li>
			<li><a href="{$base_dir_ssl}discount.php" title="">{l s='vouchers'}</a></li>
		    <li><a href="{$base_dir_ssl}order-follow.php" class="selected" title="{l s='Merchandise returns'}">{l s='Merchandise returns'}</a></li>
			<li><a href="{$base_dir_ssl}addresses.php" title="">{l s='addresses'}</a></li>
			<li><a href="{$base_dir_ssl}identity.php" title="">{l s='personal info'}</a></li>
		</ul>
</div>
{if $errorQuantity}
	<p class="error">{l s='You do not have enough products to request another merchandise return.'}</p>
{/if}
{if $errorMsg}
	<p class="error">{l s='Please provide an explanation for your RMA.'}</p>
{/if}
{if $errorDetail}
	<p class="error">{l s='Please indicate which product and the quantity you want to return.'}</p>
{/if}

<p>{l s='Here are the merchandise returns you have made since ordering'}.</p>
<div class="block-center" id="block-history">
	{if $ordersReturn && count($ordersReturn)}
	<table id="order-list" class="std">
		<thead>
			<tr>
				<th class="first_item">{l s='Return'}</th>
				<th class="item">{l s='Order'}</th>
				<th class="item">{l s='Package status'}</th>
				<th class="item">{l s='Date issued'}</th>
				<th class="last_item">{l s='Return slip'}</th>
			</tr>
		</thead>
		<tbody>
		{foreach from=$ordersReturn item=return name=myLoop}
			<tr class="{if $smarty.foreach.myLoop.first}first_item{elseif $smarty.foreach.myLoop.last}last_item{else}item{/if} {if $smarty.foreach.myLoop.index % 2}alternate_item{/if}">
				<td class="bold"><a class="color-myaccount" href="javascript:showOrder(0, {$return.id_order_return|intval}, 'order-return');">{l s='#'}{$return.id_order_return|string_format:"%06d"}</a></td>
				<td class="history_method"><a class="color-myaccount" href="javascript:showOrder(1, {$return.id_order|intval}, 'order-detail');">{l s='#'}{$return.id_order|string_format:"%06d"}</a></td>
				<td class="history_method"><span class="bold">{$return.state_name|escape:'htmlall':'UTF-8'}</span></td>
				<td class="bold">{dateFormat date=$return.date_add full=0}</td>
				<td class="history_invoice">
				{if $return.state == 2}
					<a href="{$base_dir}pdf-order-return.php?id_order_return={$return.id_order_return|intval}" title="{l s='Order return'} {l s='#'}{$return.id_order_return|string_format:"%06d"}"><img src="{$img_dir}icon/pdf.gif" alt="{l s='Order return'} {l s='#'}{$return.id_order_return|string_format:"%06d"}" class="icon" /></a>
					<a href="{$base_dir}pdf-order-return.php?id_order_return={$return.id_order_return|intval}" title="{l s='Order return'} {l s='#'}{$return.id_order_return|string_format:"%06d"}">{l s='Print out'}</a>
				{else}
					--
				{/if}
				</td>
			</tr>
		{/foreach}
		</tbody>
	</table>
	<div id="block-order-detail" class="hidden">&nbsp;</div>
	{else}
		<p class="warning">{l s='You have no return merchandise authorizations.'}</p>
	{/if}
</div>