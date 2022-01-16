function validate(Element)
{
    Element = Element || '';
    var All_Forms_Data_Temp = {};
    var Result = false;

    if(Element != '')
    {
        $(Element).find('input,select,textarea').each(function(i){ 
            All_Forms_Data_Temp[i] = $(this);
        });
    }
    else
    {
        $('input,select,textarea').each(function(i){ 
            All_Forms_Data_Temp[i] = $(this);
        });
    }


    $.each(All_Forms_Data_Temp,function(){ 
        var input = $(this);
        var Element_Name;
        var Element_Value;

	if(!input.attr('required')) return;

        if((input.attr('type') == 'submit') || (input.attr('type') == 'button'))
        {
            return true;
        }

        if((input.attr('name') !== undefined) && (input.attr('name') != ''))
        {
            Element_Name = input.attr('name').trim();
        }
        else if((input.attr('id') !== undefined) && (input.attr('id') != ''))
        {
            Element_Name = input.attr('id').trim();
        }
        else if((input.attr('class') !== undefined) && (input.attr('class') != ''))
        {
            Element_Name = input.attr('class').trim();
        }

        if(input.val() !== undefined)
        {
            if((input.attr('type')  == 'radio') || (input.attr('type')  == 'checkbox'))
            {
                Element_Value = $('input[name="'+Element_Name+'"]:checked').val();
            }
            else
            {
                Element_Value = input.val();
            }
        }
        else if(input.text() != undefined)
        {
            Element_Value = input.text();
        }

        if(Element_Value === undefined)
        {
            Element_Value = '';
        }
	
	//> Validate
	if(Element_Value == ""){
		alert(input.attr('title'));
		input.focus();
		Result = false;
		return false;
	} else {
		Result = true;
	}

    });

    return Result;
}
