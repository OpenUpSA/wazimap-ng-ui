import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import clsx from "clsx";

const CustomContent = React.forwardRef(function CustomContent(props, ref) {
  const {
    classes,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
    onDelete
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection
  } = useTreeItem(nodeId);

  const handleDelete = () => onDelete(nodeId);

  return (
    <div
      className={clsx(classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled
      })}
      onMouseDown={preventSelection}
      ref={ref}
    >
      <div onClick={handleExpansion} className={classes.iconContainer}>
        {icon}
      </div>
      <Button size="small" onClick={handleDelete}>
        <p>DELETE<p>
      </Button>
        {label}
    </div>
  );
});

export default CustomContent;
