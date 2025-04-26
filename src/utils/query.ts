import { Prisma } from "@prisma/client";

export const query = {
  // Optimize pagination query
  paginate<T>(
    query: Prisma.SelectSubset<T, Prisma.Args<T, "findMany">>,
    page: number = 1,
    limit: number = 10
  ): Prisma.SelectSubset<T, Prisma.Args<T, "findMany">> {
    return {
      ...query,
      skip: (page - 1) * limit,
      take: limit,
    };
  },

  // Optimize search query
  search<T>(
    query: Prisma.SelectSubset<T, Prisma.Args<T, "findMany">>,
    searchFields: string[],
    searchTerm: string
  ): Prisma.SelectSubset<T, Prisma.Args<T, "findMany">> {
    if (!searchTerm) return query;

    return {
      ...query,
      where: {
        ...query.where,
        OR: searchFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
      },
    };
  },

  // Optimize sorting
  sort<T>(
    query: Prisma.SelectSubset<T, Prisma.Args<T, "findMany">>,
    sortBy: string = "createdAt",
    order: "asc" | "desc" = "desc"
  ): Prisma.SelectSubset<T, Prisma.Args<T, "findMany">> {
    return {
      ...query,
      orderBy: {
        [sortBy]: order,
      },
    };
  },

  // Optimize includes
  include<T>(
    query: Prisma.SelectSubset<T, Prisma.Args<T, "findMany">>,
    relations: string[]
  ): Prisma.SelectSubset<T, Prisma.Args<T, "findMany">> {
    if (!relations.length) return query;

    const include: Record<string, boolean> = {};
    relations.forEach((relation) => {
      include[relation] = true;
    });

    return {
      ...query,
      include,
    };
  },

  // Optimize select
  select<T>(
    query: Prisma.SelectSubset<T, Prisma.Args<T, "findMany">>,
    fields: string[]
  ): Prisma.SelectSubset<T, Prisma.Args<T, "findMany">> {
    if (!fields.length) return query;

    const select: Record<string, boolean> = {};
    fields.forEach((field) => {
      select[field] = true;
    });

    return {
      ...query,
      select,
    };
  },
}; 