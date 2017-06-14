var baseUrl = "http://pokeapi.co";
var api = "api";
var version = "v1";
var resources = {
    "pokedex":"pokedex",
    "pokemon":"pokemon",
    "type":"type",
    "move":"move",
    "ability":"ability",
    "egg":"egg",
    "description":"description",
    "sprite":"sprite",
    "game":"game"
};
var id = "1";
var curPokemon = "";
var loading = [];
function main()
{
    // enableConsole(400);
    populateSelectorFromApi("/api/v1/pokedex/1/");

    $("#pokeSearchButton").click(function()
	{
        $("#page_content").css("display", "block");
        displayPokemonFromApi($("#pokeSelector").val());
        curPokemon = $("#pokeSelector option:selected").text();
        updateSearchButton();
    });

    $("#sprites").click(function()
    {
        if ($("#sprites img").length > 1)
        	showNextSprite();
    });

    $("#pokeSelector").change(function()
    {
        updateSearchButton();
    });
}

function makeUrl(objects)
{
    if (typeof objects !== "object")
    {
        var errorMsg = "makeURL only accepts parameters of type 'object', not '" + typeof objects + "'";
        console.log(errorMsg);
        throw errorMsg;
    }
    for (var i = 0; i < objects.length; i++)
    {
        if (typeof objects[i] === "undefined")
        {
            var errorMsg = "One of array elements makeUrl received was undefined.";
            console.log(errorMsg);
            throw errorMsg;
        }
    }

    return objects.join("/");
}

function clearPokemon()
{
    $("#name").html("");
    $("#species").html("");
    $("#sprites").html("").css("cursor", "default");
    $("#types").html("");
    $("#national_id").html("");
    $("#pkdx_id").html("");
    $("#hp").html("");
    $("#attack").html("");
    $("#defense").html("");
    $("#sp_atk").html("");
    $("#sp_def").html("");
    $("#speed").html("");
    $("#total").html("");
    $("#descriptions").html("");
    $("#abilities").html("");
    $("#evolutions").html("");
    $("#catch_rate").html("");
    $("#egg_cycles").html("");
    $("#egg_groups").html("");
    $("#ev_yield").html("");
    $("#exp").html("");
    $("#growth_rate").html("");
    $("#happiness").html("");
    $("#height").html("");
    $("#weight").html("");
    $("#male_female_ratio").html("");
    $("#tutor_moves").html("");
    $("#machine_moves").html("");
    $("#egg_moves").html("");
    $("#level_up_moves").html("");
    $("#other_moves").html("");
}

function displayPokemon(pkmn)
{
    clearPokemon();

    $("#name").text(pkmn.name);
    $("#species").text(pkmn.species);
    for (var i = 0; i < pkmn.sprites.length; i++)
        addSpriteFromApi(pkmn.sprites[i].resource_uri);
    // TODO: make api call
    for (var i = 0; i < pkmn.types.length; i++)
        $("#types").text($("#types").text() + pkmn.types[i].name + " ");
    $("#national_id").text(pkmn.national_id);
    $("#pkdx_id").text(pkmn.pkdx_id);
    $("#hp").text(pkmn.hp);
    $("#attack").text(pkmn.attack);
    $("#defense").text(pkmn.defense);
    $("#sp_atk").text(pkmn.sp_atk);
    $("#sp_def").text(pkmn.sp_def);
    $("#speed").text(pkmn.speed);

    // NOT POPULATED IN THE API
    //$("#total").text(pkmn.total);

    $("#total").text(function(){
    	var total = 0;
        total += parseInt($("#hp").text());
        total += parseInt($("#attack").text());
        total += parseInt($("#defense").text());
        total += parseInt($("#sp_atk").text());
        total += parseInt($("#sp_def").text());
        total += parseInt($("#speed").text());
        return total;
    });

    // TODO: make api call
    for (var i = 0; i < pkmn.descriptions.length; i++)
        addDescriptionFromApi(pkmn.descriptions[i].resource_uri);
    // TODO: make api call
    for (var i = 0; i < pkmn.abilities.length; i ++)
        $("#abilities").append($("<div>").text(pkmn.abilities[i].name));
    // TODO: make api call
    for (var i = 0; i < pkmn.evolutions.length; i++)
        $("#evolutions").append($("<div>").text("To: " + pkmn.evolutions[i].to + " Method: " + pkmn.evolutions[i].method));
    $("#catch_rate").text(pkmn.catch_rate);
    $("#egg_cycles").text(pkmn.egg_cycles);
    // TODO: make api call
    for (var i = 0; i < pkmn.egg_groups.length; i++)
    	$("#egg_groups").append($("<div>").text(pkmn.egg_groups[i].name));
    $("#ev_yield").text(pkmn.ev_yield);
    $("#exp").text(pkmn.exp);
    $("#growth_rate").text(pkmn.growth_rate);
    $("#happiness").text(pkmn.happiness);
    $("#height").text(pkmn.height);
    $("#weight").text(pkmn.weight);
    $("#male_female_ratio").text(pkmn.male_female_ratio);
    // TODO: make api call
    for (var i = 0; i < pkmn.moves.length; i++)
    {
        var target;
        switch(pkmn.moves[i].learn_type)
        {
            case "tutor":
                target = $("#tutor_moves");
                break;
            case "machine":
                target = $("#machine_moves");
                break;
            case "egg move":
                target = $("#egg_moves");
                break;
            case "level up":
                target = $("#level_up_moves");
                break;
            default:
                target = $("#other_moves");
        }
        var moveBlock = $("<div>");
        moveBlock.addClass("move");
        moveBlock.text(pkmn.moves[i].name);
        target.append(moveBlock);
    }
    loadingComplete("pokemon");
}

function displayPokemonFromApi(uri)
{
    startLoading("pokemon");
    $.getJSON(baseUrl + uri, function(data){displayPokemon(data);});
}

function addSprite(sprite)
{
    $("#sprites").append($("<img>").attr("src", baseUrl + sprite.image));
    setVisibleSprite(0);
    if ($("#sprites img").length > 1)
        $("#sprites").css("cursor", "pointer");
    loadingComplete("sprite");
}

function addSpriteFromApi(uri)
{
    startLoading("sprite");
    $.getJSON(baseUrl + uri, function(data){addSprite(data);});
}

function setVisibleSprite(index)
{
    var n = index % $("#sprites img").length;
    $("#sprites img").removeClass("current");
    $("#sprites img")[n].classList.add("current");
}

function showNextSprite()
{
    if ($("#sprites .current").next().length == 0)
    {
        $("#sprites .current").removeClass("current");
        $("#sprites img")[0].classList.add("current");
    }
    else
    {
        $("#sprites .current").next().addClass("current").prev().removeClass("current");
    }
}

function addDescription(descrip)
{
    //*
    var games = [];
    var itemText = "";
    for (var i = 0; i < descrip.games.length; i++)
    {
        games.push(descrip.games[i].name);
    }
    itemText += games.join("|");
    itemText += ": ";
    itemText += descrip.description;
    if ($("#descriptions > *").length > 0)
    	$("#descriptions").append($("<hr/>"));
    $("#descriptions").append($("<div>").text(itemText));
    loadingComplete("description");
}

function addDescriptionFromApi(uri)
{
    startLoading("description");
    $.getJSON(baseUrl + uri, function(data){addDescription(data);});
}

function populateSelector(pokedex)
{
    // Sort the pokemon names alphabetically since they come in in no
    // particular order in the API, and there is no number associated
    // with each entry.
    pokedex.pokemon.sort(function(a, b){
        return a.name.localeCompare(b.name);
    });

    for (var i = 0; i < pokedex.pokemon.length; i++)
    {
        var opt = $("<option>").attr("value", "/" + pokedex.pokemon[i].resource_uri);
        opt.text(pokedex.pokemon[i].name);
        $("#pokeSelector").append(opt);
    }
    loadingComplete("pokedex");
}

function populateSelectorFromApi(uri)
{
    startLoading("pokedex");
    $.getJSON(baseUrl + uri, function(data){populateSelector(data);});
}

function startLoading(item)
{
    loading.push(item);
    $("#pokeSearchButton").text("Loading...");
    updateSearchButton();
}

function loadingComplete(item)
{
    var i = loading.indexOf(item);
    if (i != -1)
        loading.splice(i, 1);
    if (loading.length === 0)
    {
        $("#pokeSearchButton").text("Select");
    	updateSearchButton();
    }
}

function updateSearchButton()
{
    if (loading.length !== 0
        || $("#pokeSelector option:selected").text() === curPokemon)
    	$("#pokeSearchButton").prop("disabled", true);
    else
    	$("#pokeSearchButton").prop("disabled", false);
}

$(document).ready(main);
