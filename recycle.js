<DropdownButton id="dropdown-basic-button" title={gearTypeState}>
<Dropdown.Item
    value={GearTypes.armor1302}
    as="button"
    onClick={(e) => {
        setGearTypeState(e.target.value);
    }}
    active={gearTypeState === GearTypes.armor1302}
>
    {GearTypes.armor1302}
</Dropdown.Item>
<Dropdown.Item
    value={GearTypes.weapon1302}
    as="button"
    onClick={(e) => {
        setGearTypeState(e.target.value);
    }}
    active={gearTypeState === GearTypes.weapon1302}
>
    {GearTypes.weapon1302}
</Dropdown.Item>
</DropdownButton>