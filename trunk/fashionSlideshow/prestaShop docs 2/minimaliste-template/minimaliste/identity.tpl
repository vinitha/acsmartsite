{capture name=path}<a href="my-account.php">{l s='My account'}</a>
<span class="navigation-pipe">{$navigationPipe}</span>{l s='Your personal information'}{/capture}
{include file=$tpl_dir./breadcrumb.tpl}
<h2>
  <strong style="float:left; background: #f4f8f9;">{l s='My account'}</strong>
  <a href="{$base_dir}index.php?mylogout" id="logout" title="{l s='log out'}">{l s='Sign out'}</a>
  </h2>
<div id="myaccountnav">
		<ul>
	        <li class="bnthyshome"><a href="{$base_dir_ssl}my-account.php">{l s='Home'}</a></li>
			<li><a href="{$base_dir_ssl}history.php" title="">{l s='orders'}</a></li>
			<li><a href="{$base_dir_ssl}order-slip.php" title="">{l s='credit slips'}</a></li>
			<li><a href="{$base_dir_ssl}discount.php" title="">{l s='vouchers'}</a></li>
		    <li><a href="{$base_dir_ssl}order-follow.php" title="{l s='Merchandise returns'}">{l s='Merchandise returns'}</a></li>
			<li><a href="{$base_dir_ssl}addresses.php" title="">{l s='addresses'}</a></li>
			<li><a href="{$base_dir_ssl}identity.php" class="selected" title="">{l s='personal info'}</a></li>
		</ul>
</div>
<div>
{include file=$tpl_dir./errors.tpl}
{if $confirmation}
	<p class="success">
		{l s='Your personal information has been successfully updated.'}
		{if $pwd_changed}<br />{l s='Your password has been sent to your e-mail:'} {$email|escape:'htmlall':'UTF-8'}{/if}
	</p>
{else}
	<p>{l s='Do not hesitate to update your personal information if it has changed.'}</p>
	<form action="{$request_uri|escape:'htmlall':'UTF-8'}" method="post" class="std">
		<fieldset>
			<p id="identitygender">
				<span>{l s='Gender'}</span>
				<input type="radio" id="id_gender1" name="id_gender" value="1" {if $smarty.post.id_gender == 1 OR !$smarty.post.id_gender}checked="checked"{/if} />
				<strong for="id_gender1">{l s='Mr.'}</strong>
				<input type="radio" id="id_gender2" name="id_gender" value="2" {if $smarty.post.id_gender == 2}checked="checked"{/if} />
				<strong for="id_gender2">{l s='Ms.'}</strong>
			</p>
			<p id="required">
				<label for="firstname">{l s='First name'}<sup>*</sup></label>
				<input type="text" id="firstname" name="firstname" value="{$smarty.post.firstname}" />
			</p>
			<p id="required">
				<label for="lastname">{l s='Last name'}<sup>*</sup></label>
				<input type="text" name="lastname" id="lastname" value="{$smarty.post.lastname}" />
			</p>
			<p id="required">
				<label for="email">{l s='E-mail'}<sup>*</sup></label>
				<input type="text" name="email" id="email" value="{$smarty.post.email}" />
			</p>
			<p id="required">
				<label for="old_passwd">{l s='Current password'}</label>
				<input type="password" name="old_passwd" id="old_passwd" />
			</p>
			<p id="required">
				<label for="passwd">{l s='Password'}</label>
				<input type="password" name="passwd" id="passwd" />
			</p>
			<p id="required">
				<label for="confirmation">{l s='Confirmation'}</label>
				<input type="password" name="confirmation" id="confirmation" />
			</p>
			<p id="required" class="select_date">
				<label>{l s='Birthday'}</label>
				<select  name="days" id="days">
					<option value="">-</option>
					{foreach from=$days item=v}
						<option value="{$v|escape:'htmlall':'UTF-8'}" {if ($sl_day == $v)}selected="selected"{/if}>{$v|escape:'htmlall':'UTF-8'}&nbsp;&nbsp;</option>
					{/foreach}
				</select>
				{*
					{l s='January'}
					{l s='February'}
					{l s='March'}
					{l s='April'}
					{l s='May'}
					{l s='June'}
					{l s='July'}
					{l s='August'}
					{l s='September'}
					{l s='October'}
					{l s='November'}
					{l s='December'}
				*}
				<select id="months" name="months">
					<option value="">-</option>
					{foreach from=$months key=k item=v}
						<option value="{$k|escape:'htmlall':'UTF-8'}" {if ($sl_month == $k)}selected="selected"{/if}>{l s="$v"}&nbsp;</option>
					{/foreach}
				</select>
				<select id="years" name="years">
					<option value="">-</option>
					{foreach from=$years item=v}
						<option value="{$v|escape:'htmlall':'UTF-8'}" {if ($sl_year == $v)}selected="selected"{/if}>{$v|escape:'htmlall':'UTF-8'}&nbsp;&nbsp;</option>
					{/foreach}
				</select>
			</p>
			<div id="pcheck">
			<p id="myaccount" class="checkbox">
				<input type="checkbox" id="newsletter" name="newsletter" value="1" {if $smarty.post.newsletter == 1} checked="checked"{/if} />
				<label for="newsletter">{l s='Sign up for our newsletter'}</label>
			</p>
			<p id="myaccount" class="checkbox">
				<input type="checkbox" name="optin" id="optin" value="1" {if $smarty.post.optin == 1} checked="checked"{/if} />
				<label for="optin">{l s='Receive special offers from our partners'}</label>
			</p>
			</div>
			<p class="submit">
			 <input type="submit" class="buttonvalidate" name="submitIdentity" value="{l s='Save'}" />
			</p>
		</fieldset>
	</form>
	<p class="required"><sup>*</sup>{l s='Required field'}</p>
{/if}
<span id="security_informations">{l s='[Insert customer data privacy clause or law here, if applicable]'}</span>
</div>