export function requireOwner(req, res, next) {
  //   const userId = req.user.sub;
  const userId = Number(req.user.sub);
  const listing = req.listing;
  if (userId !== listing.ownerId) {
    return res.status(403).json({ error: "Forbidden" });
  } else {
    next();
  }
}
